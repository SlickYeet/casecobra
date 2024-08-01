import { HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string
  dark?: boolean
}

export const Phone = ({
  imgSrc,
  dark = false,
  className,
  ...props
}: PhoneProps) => {
  return (
    <div
      className={cn(
        "pointer-events-none relative z-50 overflow-hidden",
        className,
      )}
      {...props}>
      <img
        src={
          dark
            ? "/phone-template-dark-edges.png"
            : "/phone-template-white-edges.png"
        }
        alt="phone image"
        className="pointer-events-none z-50 select-none"
      />

      <div className="absolute inset-0 -z-10">
        <img
          src={imgSrc}
          alt="overlaying phone image"
          className="min-h-full min-w-full object-cover"
        />
      </div>
    </div>
  )
}
