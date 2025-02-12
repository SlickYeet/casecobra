"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import type { Dispatch, SetStateAction } from "react"

import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="absolute z-[9999999]">
        <DialogHeader>
          <div className="relative mx-auto mb-2 h-24 w-24">
            <Image
              src="/snake-1.png"
              alt="snake image"
              className="object-contain"
              fill
            />
          </div>
          <DialogTitle className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Log in to continue
          </DialogTitle>
          <DialogDescription className="py-2 text-center text-base">
            <span className="font-medium text-zinc-900">
              Your configuration was saved!
            </span>{" "}
            Please login or create an account to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <Link
            href={
              pathname !== "/" && !id
                ? `/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`
                : id
                  ? `/auth/signin?callbackUrl=${encodeURIComponent(pathname)}&id=${id}`
                  : "/auth/signin"
            }
            className={buttonVariants({ variant: "outline" })}>
            Sign in
          </Link>
          <Link
            href={
              pathname !== "/" && !id
                ? `/auth/signup?callbackUrl=${encodeURIComponent(pathname)}`
                : id
                  ? `/auth/signup?callbackUrl=${encodeURIComponent(pathname)}&id=${id}`
                  : "/auth/signup"
            }
            className={buttonVariants({ variant: "default" })}>
            Sign up
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
