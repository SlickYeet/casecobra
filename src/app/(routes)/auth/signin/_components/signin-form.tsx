"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { signin } from "@/lib/services/auth-service"

const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const SigninForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const id = searchParams.get("id")

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const isPending = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof SigninSchema>) => {
    const res = await signin(values)
    if (!res.success) {
      toast({
        title: res.message,
        variant: "destructive",
      })
    } else {
      router.push(
        callbackUrl && id
          ? `${callbackUrl}?id=${id}`
          : callbackUrl && !id
            ? callbackUrl
            : "/",
      )
    }
  }

  const styles = {
    input:
      "border-0 bg-background/50 ring-1 ring-input placeholder:text-muted-foreground  focus-visible:ring-primary",
  }

  return (
    <MaxWidthWrapper className="flex items-center justify-center pt-10">
      <div>
        <div className="mx-auto mb-10 flex flex-col items-center justify-center space-y-4">
          <Link href="/" className="z-40 flex font-semibold">
            case<span className="text-green-600">cobra</span>
          </Link>

          <h1 className="text-center text-3xl font-bold leading-9 tracking-tight md:text-4xl lg:text-5xl">
            Sign in
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jdoe@gmail.com"
                      {...field}
                      className={styles.input}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="********"
                      {...field}
                      className={styles.input}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full uppercase shadow-md">
              {isPending ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold leading-6 text-primary underline-offset-2 hover:underline">
            SIgn up!
          </Link>
        </p>
      </div>
    </MaxWidthWrapper>
  )
}
