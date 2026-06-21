"use client"

import { useState, useCallback, useRef } from "react"
import { testRegex, buildHighlightedHTML } from "@/lib/regex"

const SAMPLE_PATTERN = "(\\w+)@(\\w+\\.\\w+)"
const SAMPLE_INPUT = `İletişim için ahmet@gmail.com veya mehmet@hotmail.com adresine yaz.
Geçersiz: @nodomain, eksik@, test@.com`

const FLAG_OPTIONS = [
  { flag: "g", label: "g", desc: "global" },
  { flag: "i", label: "i", desc: "ignore case" },
  { flag: "m", label: "m", desc: "multiline" },
  { flag: "s", label: "s", desc: "dotAll" },
]

export default function RegexTester() {
  const [pattern, setPattern] = useState(SAMPLE_PATTERN)
  const [flags, setFlags] = useState("g")
  const [input, setInput] = useState(SAMPLE_INPUT)
  const [highlighted, setHighlighted] = useState("")
  const [matches, setMatches] = useState<import("@/lib/regex").RegexMatch[]>([])
  const [status, setStatus] = useState<{ type: "ok" | "error" | "idle"; msg: string }>({ type: "idle", msg: "" })
  const debounce = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const run = useCallback((p: string, f: string, inp: string) => {
    if (!p) { setHighlighted(""); setMatches([]); setStatus({ type: "idle", msg: "Pattern girin" }); return }
    const r = testRegex(p, f, inp)
    if (r.ok) {
      setMatches(r.matches)
      setHighlighted(buildHighlightedHTML(inp, r.matches))
      setStatus({ type: "ok", msg: r.count === 0 ? "Eşleşme bulunamadı" : `${r.count} eşleşme bulundu` })
    } else {
      setMatches([])
      setHighlighted("")
      setStatus({ type: "error", msg: r.error })
    }
  }, [])

  const onPatternChange = (val: string) => {
    setPattern(val)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => run(val, flags, input), 200)
  }

  const onFlagToggle = (flag: string) => {
    const newFlags = flags.includes(flag) ? flags.replace(flag, "") : flags + flag
    setFlags(newFlags)
    run(pattern, newFlags, input)
  }

  const onInputChange = (val: string) => {
    setInput(val)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => run(pattern, flags, val), 200)
  }

  const dotColor = status.type === "ok" ? (matches.length > 0 ? "bg-emerald-400" : "bg-yellow-400") : status.type === "error" ? "bg-red-400" : "bg-white/20"
  const msgColor = status.type === "ok" ? (matches.length > 0 ? "text-emerald-400" : "text-yellow-400") : status.type === "error" ? "text-red-400" : "text-white/40"

  return (
    <>
      {/* Pattern input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
          <span className="px-4 text-white/30 font-mono text-sm select-none">/</span>
          <input
            value={pattern}
            onChange={(e) => onPatternChange(e.target.value)}
            placeholder="regex pattern"
            spellCheck={false}
            className="flex-1 h-11 bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/20"
          />
          <span className="px-2 text-white/30 font-mono text-sm select-none">/</span>
          <div className="flex gap-1 px-3 border-l border-white/8">
            {FLAG_OPTIONS.map(({ flag, label, desc }) => (
              <button
                key={flag}
                onClick={() => onFlagToggle(flag)}
                title={desc}
                className={`w-7 h-7 rounded font-mono text-xs transition-colors ${
                  flags.includes(flag)
                    ? "bg-indigo-500 text-white"
                    : "text-white/30 hover:text-white hover:bg-white/8"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs font-mono min-h-5">
        <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span className={msgColor}>{status.msg}</span>
      </div>

      {/* Editor panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Test metni</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Test edilecek metni buraya yaz..."
            spellCheck={false}
            className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed bg-transparent text-white resize-none outline-none placeholder:text-white/20"
          />
        </div>

        <div className="flex flex-col bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Eşleşmeler</span>
          </div>
          <div
            className="flex-1 min-h-64 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: highlighted || `<span style="color:rgba(255,255,255,0.2)">Eşleşmeler burada görünür</span>` }}
          />
        </div>
      </div>

      {/* Match list */}
      {matches.length > 0 && (
        <div className="bg-[#1a1d27] border border-white/8 rounded-xl overflow-hidden">
          <div className="px-3 py-2 bg-[#22263a] border-b border-white/8">
            <span className="text-xs font-medium tracking-widest text-white/30 uppercase">Eşleşme detayları</span>
          </div>
          <div className="divide-y divide-white/5 max-h-48 overflow-auto">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-2 text-xs font-mono">
                <span className="text-white/30 w-6">{i + 1}</span>
                <span className="text-emerald-400 flex-1">{m.value}</span>
                <span className="text-white/30">index: {m.index}</span>
                <span className="text-white/30">uzunluk: {m.length}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}