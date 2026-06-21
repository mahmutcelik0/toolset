export type ToolCategoryId =
  | "developer"
  | "pdf"
  | "image"
  | "convert"
  | "security"
  | "seo"

export interface ToolCategory {
  id: ToolCategoryId
  name: string
  emoji: string
  toolCount: number
  description: string
}

export interface Tool {
  id: string
  name: string
  href: string | null
  category: ToolCategoryId
  description: string
  popular?: boolean
  isNew?: boolean
  keywords: string[]
}

export const TOTAL_TOOL_COUNT = 500

export const categories: ToolCategory[] = [
  {
    id: "developer",
    name: "Developer Tools",
    emoji: "👨‍💻",
    toolCount: 25,
    description: "JSON, Regex, encoding & more",
  },
  {
    id: "pdf",
    name: "PDF Tools",
    emoji: "📄",
    toolCount: 40,
    description: "Convert, merge, split & compress",
  },
  {
    id: "image",
    name: "Image Tools",
    emoji: "🖼",
    toolCount: 35,
    description: "Compress, resize & convert",
  },
  {
    id: "convert",
    name: "Converters",
    emoji: "🔄",
    toolCount: 50,
    description: "File & data format conversion",
  },
  {
    id: "security",
    name: "Security Tools",
    emoji: "🔒",
    toolCount: 20,
    description: "Hash, encrypt & decode",
  },
  {
    id: "seo",
    name: "SEO Tools",
    emoji: "📈",
    toolCount: 30,
    description: "Meta tags, sitemap & analysis",
  },
]

export const tools: Tool[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter",
    href: "/json-formatter",
    category: "developer",
    description: "Format, validate and beautify JSON",
    popular: true,
    keywords: ["json", "formatter", "validator", "beautify", "pretty print"],
  },
  {
    id: "regex-tester",
    name: "Regex Tester",
    href: "/regex-tester",
    category: "developer",
    description: "Test regular expressions with live matching",
    popular: true,
    keywords: ["regex", "regular expression", "pattern", "test", "match"],
  },
  {
    id: "css-minifier",
    name: "CSS Minifier",
    href: "/css-minifier",
    category: "developer",
    description: "Minify and beautify CSS code",
    keywords: ["css", "minify", "beautify", "compress"],
  },
  {
    id: "base64",
    name: "Base64 Decoder",
    href: "/base64",
    category: "developer",
    description: "Encode and decode Base64 strings",
    popular: true,
    keywords: ["base64", "encode", "decode", "converter"],
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    href: null,
    category: "developer",
    description: "Generate random UUID v4 identifiers",
    popular: true,
    keywords: ["uuid", "guid", "generator", "unique id"],
  },
  {
    id: "jwt-decoder",
    name: "JWT Decoder",
    href: null,
    category: "developer",
    description: "Decode and inspect JSON Web Tokens",
    popular: true,
    keywords: ["jwt", "token", "decode", "json web token"],
  },
  {
    id: "timestamp-converter",
    name: "Timestamp Converter",
    href: null,
    category: "developer",
    description: "Convert Unix timestamps to human-readable dates",
    popular: true,
    keywords: ["timestamp", "unix", "epoch", "date", "time"],
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    href: null,
    category: "pdf",
    description: "Convert PDF documents to editable Word files",
    popular: true,
    keywords: ["pdf", "word", "docx", "convert"],
  },
  {
    id: "image-compressor",
    name: "Image Compressor",
    href: null,
    category: "image",
    description: "Reduce image file size without losing quality",
    popular: true,
    keywords: ["image", "compress", "optimize", "reduce size"],
  },
  {
    id: "pdf-merger",
    name: "PDF Merger",
    href: null,
    category: "pdf",
    description: "Combine multiple PDF files into one",
    isNew: true,
    keywords: ["pdf", "merge", "combine", "join"],
  },
  {
    id: "pdf-splitter",
    name: "PDF Splitter",
    href: null,
    category: "pdf",
    description: "Split PDF files into separate pages",
    isNew: true,
    keywords: ["pdf", "split", "extract", "pages"],
  },
  {
    id: "webp-converter",
    name: "WebP Converter",
    href: null,
    category: "image",
    description: "Convert images to and from WebP format",
    isNew: true,
    keywords: ["webp", "convert", "image", "png", "jpg"],
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    href: null,
    category: "security",
    description: "Generate MD5, SHA-256 and other hashes",
    isNew: true,
    keywords: ["hash", "md5", "sha256", "checksum"],
  },
]

export const popularTools = tools.filter((t) => t.popular)
export const newTools = tools.filter((t) => t.isNew)

export const heroPopularLinks = [
  "JSON Formatter",
  "PDF to Word",
  "Regex Tester",
  "Image Compressor",
] as const

export function getToolsByCategory(categoryId: ToolCategoryId): Tool[] {
  return tools.filter((t) => t.category === categoryId)
}

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return tools.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
  )
}

export function getToolByName(name: string): Tool | undefined {
  return tools.find((t) => t.name === name)
}
