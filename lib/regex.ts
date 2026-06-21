// lib/regex.ts
export type RegexResult =
  | { ok: true; matches: RegexMatch[]; count: number }
  | { ok: false; error: string }

export type RegexMatch = {
  value: string
  index: number
  length: number
  groups?: Record<string, string>
}

export function testRegex(pattern: string, flags: string, input: string): RegexResult {
  try {
    const re = new RegExp(pattern, flags)
    const matches: RegexMatch[] = []
    let m: RegExpExecArray | null

    if (flags.includes("g")) {
      while ((m = re.exec(input)) !== null) {
        matches.push({ value: m[0], index: m.index, length: m[0].length, groups: m.groups })
        if (m[0].length === 0) re.lastIndex++
      }
    } else {
      m = re.exec(input)
      if (m) matches.push({ value: m[0], index: m.index, length: m[0].length, groups: m.groups })
    }

    return { ok: true, matches, count: matches.length }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export function buildHighlightedHTML(input: string, matches: RegexMatch[]): string {
  if (matches.length === 0) return escapeHtml(input)
  let result = ""
  let last = 0
  const colors = ["#fbbf24", "#34d399", "#60a5fa", "#f472b6", "#a78bfa"]
  matches.forEach((m, i) => {
    result += escapeHtml(input.slice(last, m.index))
    result += `<mark style="background:${colors[i % colors.length]}33;color:${colors[i % colors.length]};border-radius:3px;padding:0 2px">${escapeHtml(m.value)}</mark>`
    last = m.index + m.length
  })
  result += escapeHtml(input.slice(last))
  return result
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}