import { redirect } from "next/navigation"

import { validateSession } from "@/lib/lucia"

import { SignupForm } from "./_components/signup-form"

const Signup = async () => {
  const { user } = await validateSession()
  if (user) {
    return redirect("/")
  }

  return <SignupForm />
}

export default Signup
