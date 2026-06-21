// lib/css.ts
export type CSSResult =
  | { ok: true; output: string; originalSize: number; newSize: number; saving: number }
  | { ok: false; error: string }

export function minifyCSS(input: string): CSSResult {
  try {
    const output = input
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,>~+])\s*/g, "$1")
      .replace(/;}/g, "}")
      .replace(/^\s+|\s+$/g, "")

    const originalSize = new TextEncoder().encode(input).length
    const newSize = new TextEncoder().encode(output).length
    return { ok: true, output, originalSize, newSize, saving: Math.round((1 - newSize / originalSize) * 100) }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export function beautifyCSS(input: string): CSSResult {
  try {
    const minified = (minifyCSS(input) as { ok: true; output: string }).output
    let depth = 0
    let output = ""
    let i = 0
    while (i < minified.length) {
      const ch = minified[i]
      if (ch === "{") {
        output += " {\n" + "  ".repeat(++depth)
      } else if (ch === "}") {
        depth--
        output = output.trimEnd()
        output += "\n" + "  ".repeat(depth) + "}\n" + (depth === 0 ? "\n" : "  ".repeat(depth))
      } else if (ch === ";") {
        output += ";\n" + "  ".repeat(depth)
      } else {
        output += ch
      }
      i++
    }
    output = output.trim()
    const originalSize = new TextEncoder().encode(input).length
    const newSize = new TextEncoder().encode(output).length
    return { ok: true, output, originalSize, newSize, saving: 0 }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}