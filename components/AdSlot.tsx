// components/AdSlot.tsx
"use client"

// Şimdilik placeholder — AdSense onayı gelince publisher ID eklenecek
// NEXT_PUBLIC_ADSENSE_ID .env.local'a ekle
export default function AdSlot({
  slot,
  format = "auto",
  className = "",
}: {
  slot: string
  format?: string
  className?: string
}) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID

  if (!publisherId) {
    return (
      <div
        className={`flex items-center justify-center border border-dashed border-white/10 rounded-lg text-xs text-white/20 font-mono tracking-widest ${className}`}
      >
        ADVERTISEMENT
      </div>
    )
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: "block" }}
      data-ad-client={publisherId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}