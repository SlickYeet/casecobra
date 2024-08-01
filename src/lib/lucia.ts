import { User as DbUser } from "@prisma/client"
import { Lucia, Session, User } from "lucia"
import { cookies } from "next/headers"
import { cache } from "react"

import { adapter } from "@/lib/db/adapter"

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      ...attributes,
    }
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DbUser
  }
}

export const validateSession = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null
    if (!sessionId) {
      return {
        user: null,
        session: null,
      }
    }

    const res = await lucia.validateSession(sessionId)

    try {
      if (res.session && res.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(res.session.id)
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        )
      }
      if (!res.session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        )
      }
    } catch (error) {
      // next.js throws when you attempt to set cookie when rendering page
    }

    return res
  },
)
