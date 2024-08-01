import { redirect } from "next/navigation"

import { validateSession } from "@/lib/lucia"

import { SigninForm } from "./_components/signin-form"

const Signin = async () => {
  const { session } = await validateSession()
  if (session) {
    return redirect("/")
  }

  return <SigninForm />
}

export default Signin
