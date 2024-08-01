import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Resend } from "resend"
import Stripe from "stripe"

import OrderReceivedEmail from "@/components/emails/order-received-email"
import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")
    if (!signature) {
      return new Response("Invalid signature", { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET ?? "",
    )
    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error("Missing user email")
      }

      const paymentSession = event.data.object as Stripe.Checkout.Session

      const { userId, orderId } = paymentSession.metadata || {
        userId: null,
        orderId: null,
      }
      if (!userId || !orderId) {
        throw new Error("Invalid request metadata")
      }

      const billingAddress = paymentSession.customer_details!.address
      const shippingAddress = paymentSession.shipping_details!.address

      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: paymentSession.customer_details!.name!,
              city: shippingAddress!.city!,
              country: shippingAddress!.country!,
              postalCode: shippingAddress!.postal_code!,
              street: shippingAddress!.line1!,
              state: shippingAddress!.state!,
            },
          },
          billingAddress: {
            create: {
              name: paymentSession.customer_details!.name!,
              city: billingAddress!.city!,
              country: billingAddress!.country!,
              postalCode: billingAddress!.postal_code!,
              street: billingAddress!.line1!,
              state: billingAddress!.state!,
            },
          },
        },
      })

      await resend.emails.send({
        from: "CaseCobra <lasse@famlam.ca>",
        to: [event.data.object.customer_details.email],
        subject: "Thanks for your order!",
        react: OrderReceivedEmail({
          // @ts-ignore
          shippingAddress: {
            name: paymentSession.customer_details!.name!,
            city: shippingAddress!.city!,
            country: shippingAddress!.country!,
            postalCode: shippingAddress!.postal_code!,
            street: shippingAddress!.line1!,
            state: shippingAddress!.state!,
          },
          orderId,
          orderDate: updatedOrder.createdAt.toISOString(),
        }),
      })
    }

    return NextResponse.json({ result: event, ok: true })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 },
    )
  }
}
