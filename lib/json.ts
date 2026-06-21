// lib/json.ts
export type FormatResult =
  | { ok: true; output: string; keyCount: number; byteSize: number }
  | { ok: false; error: string }

export function formatJSON(raw: string, indent: number | string): FormatResult {
  try {
    const parsed = JSON.parse(raw)
    const output = JSON.stringify(parsed, null, indent)
    const keyCount = (output.match(/"[^"]+"\s*:/g) ?? []).length
    const byteSize = new TextEncoder().encode(output).length
    return { ok: true, output, keyCount, byteSize }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export function minifyJSON(raw: string): FormatResult {
  try {
    const output = JSON.stringify(JSON.parse(raw))
    return { ok: true, output, keyCount: 0, byteSize: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export function sortKeysJSON(raw: string, indent: number | string): FormatResult {
  try {
    const sort = (obj: unknown): unknown => {
      if (Array.isArray(obj)) return obj.map(sort)
      if (obj && typeof obj === "object") {
        return Object.fromEntries(
          Object.keys(obj as object).sort().map((k) => [k, sort((obj as Record<string, unknown>)[k])])
        )
      }
      return obj
    }
    const output = JSON.stringify(sort(JSON.parse(raw)), null, indent)
    const keyCount = (output.match(/"[^"]+"\s*:/g) ?? []).length
    return { ok: true, output, keyCount, byteSize: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}