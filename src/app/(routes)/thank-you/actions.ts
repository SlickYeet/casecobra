"use server"

import { db } from "@/lib/db"
import { validateSession } from "@/lib/lucia"

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { user } = await validateSession()
  if (!user?.id || !user.email) {
    throw new Error("You need to be logged in to view this page.")
  }

  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.id },
    include: {
      configuration: true,
      billingAddress: true,
      shippingAddress: true,
      user: true,
    },
  })
  if (!order) {
    throw new Error("This order does not exist.")
  }
  if (order.isPaid) {
    return order
  } else {
    return false
  }
}
