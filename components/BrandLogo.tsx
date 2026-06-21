import Link from "next/link"

function LogoMark({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div
      className={`${className} bg-blue-500 rounded-[9px] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.25)]`}
    >
      <svg viewBox="0 0 20 20" fill="none" className="w-[55%] h-[55%]" aria-hidden="true">
        <rect x="2" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.95" />
        <rect x="11" y="2" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.55" />
        <rect x="2" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.55" />
        <rect x="11" y="11" width="7" height="7" rx="1.5" fill="white" fillOpacity="0.95" />
      </svg>
    </div>
  )
}

function Wordmark({ size }: { size: "sm" | "md" }) {
  const textSize = size === "sm" ? "text-[15px]" : "text-base"

  return (
    <span className={`${textSize} tracking-tight leading-none select-none`}>
      <span className="font-semibold text-white">toolset</span>
      <span className="font-medium text-blue-400">app</span>
    </span>
  )
}

interface BrandLogoProps {
  size?: "sm" | "md"
  showIcon?: boolean
  linked?: boolean
}

export default function BrandLogo({ size = "sm", showIcon = true, linked = true }: BrandLogoProps) {
  const content = (
    <>
      {showIcon && <LogoMark className={size === "sm" ? "w-7 h-7" : "w-8 h-8"} />}
      <Wordmark size={size} />
    </>
  )

  if (linked) {
    return (
      <Link href="/" className="flex items-center gap-2.5 no-underline group">
        {content}
      </Link>
    )
  }

  return <div className="flex items-center gap-2.5">{content}</div>
}

export { LogoMark, Wordmark }
