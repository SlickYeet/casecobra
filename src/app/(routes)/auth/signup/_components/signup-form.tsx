"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
import { ToastAction } from "@/components/ui/toast"
import { toast } from "@/components/ui/use-toast"
import { signup } from "@/lib/services/auth-service"
import { Loader2 } from "lucide-react"

const SignupSchema = z
  .object({
    username: z.string().min(3).max(32),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match.",
    path: ["passwordConfirm"],
  })

export const SignupForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const id = searchParams.get("id")

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  })

  const isPending = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof SignupSchema>) => {
    const res = await signup(values, callbackUrl, id)
    if (!res.success) {
      toast({
        title: res.message,
        variant: "destructive",
        action: res.action && (
          <ToastAction altText={res.action.message}>
            <Link href={res.action.href}>{res.action.message}</Link>
          </ToastAction>
        ),
      })
    } else {
      router.push(
        callbackUrl && id
          ? `/auth/signin?callbackUrl=${callbackUrl}?id=${id}`
          : callbackUrl && !id
            ? `auth/signin?callbackUrl=%${callbackUrl}`
            : "/auth/signin",
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
            Sign up
          </h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Username"
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
            <div className="flex items-center justify-between gap-4">
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
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirm Password</FormLabel>
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
            </div>

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
                "Sign up"
              )}
            </Button>
          </form>
        </Form>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-semibold leading-6 text-primary underline-offset-2 hover:underline">
            Sign in!
          </Link>
        </p>
      </div>
    </MaxWidthWrapper>
  )
}
