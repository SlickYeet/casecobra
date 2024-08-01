"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { buttonVariants } from "@/components/ui/button"
import { useSession } from "@/lib/providers/session-provider"
import { cn } from "@/lib/utils"

export const Navbar = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const { user } = useSession()
  const isAdmin = user?.role === "admin"

  return (
    <nav className="sticky inset-x-0 top-0 z-[100] h-14 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="z-40 flex font-semibold">
            case<span className="text-green-600">cobra</span>
          </Link>

          <div className="flex h-full items-center space-x-4">
            {user ? (
              <>
                <Link
                  href={
                    pathname !== "/" && !id
                      ? `/auth/signout?callbackUrl=${encodeURIComponent(pathname)}`
                      : id
                        ? `/auth/signout?callbackUrl=${encodeURIComponent(pathname)}&id=${id}`
                        : "/auth/signout"
                  }
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    }),
                  )}>
                  Sign out
                </Link>
                {isAdmin ? (
                  <Link
                    href="/dashboard"
                    className={cn(
                      buttonVariants({
                        size: "sm",
                        variant: "ghost",
                      }),
                    )}>
                    Dashboard <Sparkles className="ml-1.5 h-4 w-4" />
                  </Link>
                ) : null}
                <Link
                  href="/configure/upload"
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      className: "hidden items-center gap-1 sm:flex",
                    }),
                  )}>
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={
                    pathname !== "/" && !id
                      ? `/auth/signup?callbackUrl=${encodeURIComponent(pathname)}`
                      : id
                        ? `/auth/signup?callbackUrl=${encodeURIComponent(pathname)}&id=${id}`
                        : "/auth/signup"
                  }
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    }),
                  )}>
                  Sign up
                </Link>
                <Link
                  href={
                    pathname !== "/" && !id
                      ? `/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`
                      : id
                        ? `/auth/signin?callbackUrl=${encodeURIComponent(pathname)}&id=${id}`
                        : "/auth/signin"
                  }
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    }),
                  )}>
                  Sign in
                </Link>

                <div className="hidden h-8 w-px bg-zinc-200 sm:block" />

                <Link
                  href="/configure/upload"
                  className={cn(
                    buttonVariants({
                      size: "sm",
                      className: "hidden items-center gap-1 sm:flex",
                    }),
                  )}>
                  Create case
                  <ArrowRight className="ml-1.5 h-5 w-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}
