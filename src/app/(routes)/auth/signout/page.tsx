"use client"

import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

import { useSession } from "@/lib/providers/session-provider"
import { signout } from "@/lib/services/auth-service"

const Signout = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const id = searchParams.get("id")
  const { session } = useSession()
  if (!session) {
    router.push("/")
  }

  useEffect(() => {
    signout().then(() => {
      router.push(
        callbackUrl && id
          ? `${callbackUrl}?id=${id}`
          : callbackUrl && !id
            ? callbackUrl
            : "/",
      )
    })
  }, [])

  return (
    <div className="mt-24 flex w-full justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin" />
        <h3 className="text-xl font-semibold">Please wait...</h3>
        <p>We are trying to sign your out.</p>
      </div>
    </div>
  )
}

export default Signout
