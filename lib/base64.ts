// lib/base64.ts
export type Base64Result =
  | { ok: true; output: string; size: number }
  | { ok: false; error: string }

export function encodeBase64(input: string): Base64Result {
  try {
    const output = btoa(unescape(encodeURIComponent(input)))
    return { ok: true, output, size: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export function decodeBase64(input: string): Base64Result {
  try {
    const output = decodeURIComponent(escape(atob(input.trim())))
    return { ok: true, output, size: new TextEncoder().encode(output).length }
  } catch (e) {
    return { ok: false, error: "Geçersiz Base64 — decode edilemiyor" }
  }
}