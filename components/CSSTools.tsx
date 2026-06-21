"use client"

import { useState } from "react"
import { minifyCSS, beautifyCSS } from "@/lib/css"

const SAMPLE = `/* Ana stil dosyası */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.button {
  display: inline-flex;
  align-items: center;
  background-color: #5b6af0;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.button:hover {
  background-color: #7c8fff;
}`

export default function CSSTools() {
  const [input, setInput] = useState(SAMPLE)
  const [output, setOutput] = useState("")
  const [status, setStatus] = useState<{ type: "ok" | "error" | "idle"; msg: string; meta?: string }>({ type: "idle", msg: "CSS girin" })

  const doMinify = () => {
    const r = minifyCSS(input)
    if (r.ok) {
      setOutput(r.output)
      setStatus({ type: "ok", msg: `%${r.saving} küçüldü`, meta: `${r.originalSize} → ${r.newSize} byte` })
    } else setStatus({ type: "error", msg: r.error })
  }

  const doBeautify = () => {
    const r = beautifyCSS(input)
    if (r.ok) {
      setOutput(r.output)
      setStatus({ type: "ok", msg: "CSS formatlandı", meta: `${r.newSize} byte` })
    } else setStatus({ type: "error", msg: r.error })
  }

  const copy = () => {
    if (!output) return
    navigator.clipboard.writeText(output).then(() => setStatus(s => ({ ...s, msg: "Kopyalandı ✓" })))
  }

  const dotColor = status.type === "ok" ? "bg-emerald-400" : status.type === "error" ? "bg-red-400" : "bg-white/20"
  const msgColor = status.type === "ok" ? "text-emerald-400" : status.type === "error" ? "text-red-400" : "text-white/40"

  return (
    <>
      <div className="flex flex-wrap gap-2 items-center">
        <button onClick={doMinify} className="h-8 px-4 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors">
          Minify
        </button>
        <button onClick={doBeautify} className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors">
          Beautify
        </button>
        <div className="w-px h-5 bg-white/10" />
        <button onClick={() => { setInput(""); setOutput("") }} className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors">
          Temizle
        </button>
        <button onClick={() => setInput(SAMPLE)} className="h-8 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white rounded-lg transition-colors">
          Örnek yükle
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono min-h-5">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className={msgColor}>{status.msg}</span>
        {status.meta && <span className="text-white/30 ml-auto">{status.meta}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Giriş</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="CSS kodunu buraya yapıştır..."
            spellCheck={false}
            className="flex-1 min-h-96 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
          />
        </div>

        <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-[#22263a] border-b border-white/8">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Çıktı</span>
            <button onClick={copy} className="text-xs text-white/30 hover:text-white border border-white/10 rounded px-2 py-0.5 transition-colors">
              Kopyala
            </button>
          </div>
          <div className="flex-1 min-h-96 p-4 font-mono text-sm leading-relaxed whitespace-pre overflow-auto text-white/80">
            {output || <span className="text-white/20">Çıktı burada görünür</span>}
          </div>
        </div>
      </div>
    </>
  )
}