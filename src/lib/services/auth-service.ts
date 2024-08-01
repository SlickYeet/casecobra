"use server"

import { compare, hash } from "bcrypt"
import { generateId } from "lucia"
import { cookies } from "next/headers"
import { z } from "zod"

import { db } from "@/lib/db"
import { lucia, validateSession } from "@/lib/lucia"

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

const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const signup = async (
  values: z.infer<typeof SignupSchema>,
  callbackUrl: string | null,
  id: string | null,
) => {
  const hashedPassword = await hash(values.password, 12)
  const userId = generateId(15)

  const usernameExists = await db.user.findUnique({
    where: { username: values.username },
  })
  if (usernameExists) {
    return {
      success: false,
      message: "Username is already taken!",
    }
  }

  const emailExists = await db.user.findUnique({
    where: { email: values.email },
  })
  if (emailExists) {
    return {
      success: false,
      message: "An account with that email address already exists!",
      action: {
        message: "Sign in?",
        href:
          callbackUrl && id
            ? `/auth/signin?callbackUrl=${callbackUrl}?id=${id}`
            : callbackUrl && !id
              ? `/auth/signin?callbackUrl=${callbackUrl}`
              : "/auth/signin",
      },
    }
  }

  try {
    await db.user.create({
      data: {
        id: userId,
        username: values.username,
        email: values.email,
        password: hashedPassword,
      },
    })

    return {
      success: true,
      message: "Account created successfully!",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}

export const signin = async (values: z.infer<typeof SigninSchema>) => {
  try {
    SigninSchema.parse(values)
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }

  const user = await db.user.findUnique({
    where: { email: values.email },
  })
  if (!user) {
    return {
      success: false,
      message: "No account with that email address found!",
      action: {
        message: "Sign up?",
        href: "/auth/signup",
      },
    }
  }

  const passwordsMatch = await compare(values.password, user.password)
  if (!passwordsMatch) {
    return {
      success: false,
      message: "Invalide password!",
    }
  }

  try {
    const session = await lucia.createSession(user.id, {
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    })

    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )

    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      message: "Invalid email or password!",
    }
  }
}

export const signout = async () => {
  try {
    const { session } = await validateSession()
    if (!session) {
      return {
        success: false,
        message: "No session found!",
      }
    }

    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )

    await lucia.invalidateSession(session.id)

    return {
      success: true,
      message: "Signed out!",
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    }
  }
}
