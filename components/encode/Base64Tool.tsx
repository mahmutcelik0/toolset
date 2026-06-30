"use client"

import { useState } from "react"
import { encodeBase64, decodeBase64 } from "@/lib/base64"

export default function Base64Tool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [status, setStatus] = useState<{ type: "ok" | "error" | "idle"; msg: string }>({ type: "idle", msg: "Metin girin" })

  const run = (val: string, m: "encode" | "decode") => {
    if (!val) { setOutput(""); setStatus({ type: "idle", msg: "Metin girin" }); return }
    const r = m === "encode" ? encodeBase64(val) : decodeBase64(val)
    if (r.ok) {
      setOutput(r.output)
      setStatus({ type: "ok", msg: m === "encode" ? "Encode edildi" : "Decode edildi", })
    } else {
      setOutput("")
      setStatus({ type: "error", msg: r.error })
    }
  }

  const onInput = (val: string) => { setInput(val); run(val, mode) }
  const onModeChange = (m: "encode" | "decode") => { setMode(m); run(input, m) }

  const swap = () => {
    setInput(output)
    const newMode = mode === "encode" ? "decode" : "encode"
    setMode(newMode)
    run(output, newMode)
  }

  const dotColor = status.type === "ok" ? "bg-emerald-400" : status.type === "error" ? "bg-red-400" : "bg-white/20"
  const msgColor = status.type === "ok" ? "text-emerald-400" : status.type === "error" ? "text-red-400" : "text-white/40"

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex bg-[#1a1d27] border border-white/8 rounded-lg p-1 gap-1">
          {(["encode", "decode"] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`h-7 px-4 rounded text-sm transition-colors ${
                mode === m ? "bg-indigo-500 text-white font-medium" : "text-white/40 hover:text-white"
              }`}
            >
              {m === "encode" ? "Encode" : "Decode"}
            </button>
          ))}
        </div>
        <button onClick={swap} className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors">
          ⇄ Çevir
        </button>
        <button onClick={() => { setInput(""); setOutput(""); setStatus({ type: "idle", msg: "Metin girin" }) }}
          className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors">
          Temizle
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono min-h-5">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className={msgColor}>{status.msg}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
              {mode === "encode" ? "Düz metin" : "Base64"}
            </span>
          </div>
          <textarea
            value={input}
            onChange={(e) => onInput(e.target.value)}
            placeholder={mode === "encode" ? "Encode edilecek metni yaz..." : "Base64 kodunu yapıştır..."}
            spellCheck={false}
            className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
          />
        </div>

        <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">
              {mode === "encode" ? "Base64 çıktı" : "Düz metin"}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors"
            >
              Kopyala
            </button>
          </div>
          <div className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-all overflow-auto text-white/80">
            {output || <span className="text-white/20">Çıktı burada görünür</span>}
          </div>
        </div>
      </div>
    </>
  )
}