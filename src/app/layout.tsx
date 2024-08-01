import { Recursive } from "next/font/google"

import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { validateSession } from "@/lib/lucia"
import { QueryProvider } from "@/lib/providers/query-provider"
import { SessionProvider } from "@/lib/providers/session-provider"
import { constructMetadata } from "@/lib/utils"

import "./globals.css"

const font = Recursive({ subsets: ["latin"] })

export const metadata = constructMetadata()

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const sessionData = await validateSession()

  return (
    <html lang="en">
      <body className={font.className}>
        <SessionProvider sessionData={sessionData}>
          <Navbar />
          <main className="grainy-light flex min-h-[calc(100vh-3.5rem-1px)] flex-col">
            <div className="flex h-full flex-1 flex-col">
              <QueryProvider>{children}</QueryProvider>
            </div>
            <Footer />
          </main>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
