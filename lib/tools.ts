export type ToolCategoryId =
  | "developer"
  | "pdf"
  | "image"
  | "convert"
  | "seo"
  | "security"
  | "text"
  | "ai"

export type ToolGroupId =
  | "json"
  | "regex"
  | "encoding"
  | "jwt"
  | "hash"
  | "uuid"
  | "text"
  | "datetime"
  | "api"
  | "network"
  | "sql"
  | "web"
  | "productivity"
  | "yaml"

export interface ToolCategory {
  id: ToolCategoryId
  name: string
  emoji: string
  toolCount: number
  description: string
}

export interface ToolGroup {
  id: ToolGroupId
  name: string
  icon: string
}

export interface Tool {
  id: string
  name: string
  href: string | null
  category: ToolCategoryId
  group: ToolGroupId | null
  icon: string
  description: string
  popular?: boolean
  isNew?: boolean
  favorite?: boolean
  keywords: string[]
}

export const TOTAL_TOOL_COUNT = 500

export const categories: ToolCategory[] = [
  { id: "developer", name: "Developer Tools", emoji: "👨‍💻", toolCount: 78, description: "JSON, Regex, API & more" },
  { id: "pdf", name: "PDF Tools", emoji: "📄", toolCount: 40, description: "Convert, merge, split & compress" },
  { id: "image", name: "Image Tools", emoji: "🖼", toolCount: 30, description: "Compress, resize & convert" },
  { id: "convert", name: "Converters", emoji: "🔄", toolCount: 50, description: "File & data format conversion" },
  { id: "seo", name: "SEO Tools", emoji: "📈", toolCount: 15, description: "Meta tags, sitemap & analysis" },
  { id: "security", name: "Security Tools", emoji: "🔒", toolCount: 20, description: "Hash, encrypt & decode" },
  { id: "text", name: "Text Tools", emoji: "📝", toolCount: 25, description: "Convert, count & transform text" },
  { id: "ai", name: "AI Tools", emoji: "✨", toolCount: 10, description: "AI-powered utilities" },
]

export const groups: ToolGroup[] = [
  { id: "json", name: "JSON", icon: "{}" },
  { id: "regex", name: "Regex", icon: ".*" },
  { id: "encoding", name: "Encoding & Decoding", icon: "🔤" },
  { id: "jwt", name: "JWT", icon: "🔑" },
  { id: "hash", name: "Hash & Crypto", icon: "#" },
  { id: "uuid", name: "UUID & IDs", icon: "🆔" },
  { id: "text", name: "Text Utilities", icon: "📝" },
  { id: "datetime", name: "Date & Time", icon: "🕐" },
  { id: "api", name: "API Tools", icon: "🌐" },
  { id: "network", name: "Network", icon: "📡" },
  { id: "sql", name: "SQL", icon: "🗄" },
  { id: "web", name: "HTML / CSS / JS", icon: "</>" },
  { id: "productivity", name: "Developer Productivity", icon: "⚡" },
]

function tool(
  id: string,
  name: string,
  description: string,
  category: ToolCategoryId,
  group: ToolGroupId | null,
  icon: string,
  keywords: string[],
  extra: Partial<Pick<Tool, "href" | "popular" | "isNew" | "favorite">> = {}
): Tool {
  return { id, name, description, category, group, icon, keywords, href: null, ...extra }
}

export const tools: Tool[] = [
  // JSON
  tool("json-formatter", "JSON Formatter", "Format, validate and beautify JSON", "developer", "json", "{}", ["json", "formatter", "validate", "beautify", "pretty"], { href: "/json-formatter", popular: true }),
  tool("json-minifier", "JSON Minifier", "Compress JSON by removing whitespace", "developer", "json", "{}", ["json", "minify", "compress", "compact", "minifier", "compressor"],{ href: "/json-minifier", popular: true }),
  tool("json-validator", "JSON Validator", "Check if JSON syntax is valid", "developer", "json", "✅", ["json", "validator", "validate", "syntax", "checker", "doğrulama"], { href: "/json-validator", popular: true }),
  tool("json-escape", "JSON Escape / Unescape", "Escape or unescape JSON strings", "developer", "json", "🔒", ["json", "escape", "unescape", "special characters", "escape json", "unescape json"], { href: "/json-escape" }),
  tool("json-to-yaml", "JSON to YAML", "Convert JSON data to YAML format", "developer", "json", "📄", ["json", "yaml", "convert", "transformer", "json to yaml", "yaml generator"], { href: "/json-to-yaml" }),
  tool("yaml-to-json", "YAML to JSON", "Convert YAML data to JSON format", "developer", "json", "📄", ["yaml", "json", "convert", "transformer", "yaml to json", "json generator"], { href: "/yaml-to-json" }),
  tool("json-to-xml", "JSON to XML", "Convert JSON data to XML format", "developer", "json", "🔖", ["json", "xml", "convert", "transformer", "json to xml", "xml generator"], { href: "/json-to-xml" }),
  tool("xml-to-json", "XML to JSON", "Convert XML data to JSON format", "developer", "json", "🔖", ["xml", "json", "convert", "transformer", "xml to json", "json generator"], { href: "/xml-to-json" }),
  tool("json-diff-viewer", "JSON Diff Viewer", "Compare two JSON objects side by side", "developer", "json", "🔍", ["json", "diff", "compare", "viewer", "comparator", "fark"], { href: "/json-diff-viewer" }),
  tool("json-schema-validator", "JSON Schema Validator", "Validate JSON against a JSON Schema", "developer", "json", "📋", ["json", "schema", "validate", "validator", "json schema", "doğrulama"], { href: "/json-schema-validator" }),

  // Regex
  tool("regex-tester", "Regex Tester", "Test regular expressions with live matching", "developer", "regex", ".*", ["regex", "regular expression", "pattern", "test", "match"], { href: "/regex-tester", popular: true }),
  tool("regex-cheat-sheet", "Regex Cheat Sheet", "Quick reference for regex syntax", "developer", "regex", "📖", ["regex", "cheat sheet", "regular expression", "reference", "syntax"], { href: "/regex-cheat-sheet" }),
  tool("regex-generator", "Regex Generator", "Generate regular expressions from text", "developer", "regex", "⚡", ["regex", "generator", "create regex", "regex builder", "regular expression"], { href: "/regex-generator" }),
  tool("regex-replace-tester", "Regex Replace Tester", "Test regular expression replacements", "developer", "regex", "🔄", ["regex", "replace", "replace tester", "regex replace", "regular expression replace"], { href: "/regex-replace-tester" }),

  // Encoding
  tool("base64-encode", "Base64 Encode", "Encode text to Base64 format", "developer", "encoding", "🔤", ["base64", "encode", "encoding"], { href: "/base64", favorite: true }),
  tool("base64-decode", "Base64 Decode", "Decode Base64 strings to plain text", "developer", "encoding", "🔤", ["base64", "decode", "decoding"], { href: "/base64", popular: true, favorite: true }),
  tool("url-encode", "URL Encode", "Encode URLs", "developer", "encoding", "🔗", ["url", "encode", "url encode", "url encoder", "encoding"], { href: "/url-encode" }),
  tool("url-decode", "URL Decode", "Decode encoded URLs", "developer", "encoding", "🔓", ["url", "decode", "url decode", "url decoder", "decoding"], { href: "/url-decode" }),
  tool("html-encode", "HTML Encode", "Encode HTML special characters", "developer", "encoding", "🔐", ["html", "encode", "html encode", "html encoder", "entities", "xss protection"], { href: "/html-encode" }),
  tool("html-decode", "HTML Decode", "Decode HTML entities", "developer", "encoding", "🔓", ["html", "decode", "html decode", "html decoder", "entities"], { href: "/html-decode" }),
  tool("unicode-encode", "Unicode Encode", "Encode text to Unicode format", "developer", "encoding", "🔐", ["unicode", "encode", "unicode encode", "unicode encoder", "unicode converter"], { href: "/unicode-encode" }),
  tool("unicode-decode", "Unicode Decode", "Decode Unicode to text", "developer", "encoding", "🔓", ["unicode", "decode", "unicode decode", "unicode decoder", "unicode converter"], { href: "/unicode-decode" }),

  // JWT
  tool("jwt-decoder", "JWT Decoder", "Decode JWT tokens and view header and payload", "developer", "jwt", "🔑", ["jwt", "decoder", "jwt token", "json web token", "decode jwt", "jwt parser"], { href: "/jwt-decoder" }),
  tool("jwt-encoder", "JWT Encoder", "Generate JWT tokens from header and payload", "developer", "jwt", "🔐", ["jwt", "encoder", "generate jwt", "jwt token", "json web token", "jwt generator"], { href: "/jwt-encoder" }),
  tool("jwt-expiry-checker", "JWT Expiry Checker", "Check JWT token expiration and remaining time", "developer", "jwt", "⏰", ["jwt", "expiry", "expiration", "checker", "jwt token", "expiry checker", "token expiry"], { href: "/jwt-expiry-checker" }),

  // Hash & Crypto (security category)
  tool("md5-generator", "MD5 Generator", "Generate MD5 hash from any text", "security", "hash", "#", ["md5", "hash", "checksum", "crypto"]),
  tool("sha1-generator", "SHA1 Generator", "Generate SHA-1 hash from any text", "security", "hash", "#", ["sha1", "hash", "checksum", "crypto"]),
  tool("sha256-generator", "SHA256 Generator", "Generate SHA-256 hash from any text", "security", "hash", "#", ["sha256", "sha-256", "hash", "checksum"], { favorite: true }),
  tool("sha512-generator", "SHA512 Generator", "Generate SHA-512 hash from any text", "security", "hash", "#", ["sha512", "sha-512", "hash", "checksum"]),
  tool("bcrypt-generator", "Bcrypt Generator", "Generate bcrypt password hashes", "security", "hash", "#", ["bcrypt", "password", "hash", "salt"]),
  tool("hmac-generator", "HMAC Generator", "Generate HMAC signatures with a secret key", "security", "hash", "#", ["hmac", "signature", "hash", "mac"]),

  // UUID
  tool("uuid-v4", "UUID v4 Generator", "Generate random UUID v4 identifiers", "developer", "uuid", "🆔", ["uuid", "v4", "guid", "generator", "unique id"], { popular: true }),
  tool("uuid-bulk", "Bulk UUID Generator", "Generate multiple UUIDs at once", "developer", "uuid", "🆔", ["uuid", "bulk", "batch", "generator"]),
  tool("nanoid-generator", "NanoID Generator", "Generate compact unique NanoID strings", "developer", "uuid", "🆔", ["nanoid", "id", "generator", "unique"]),

  // Text Utilities
  tool("case-converter", "Case Converter", "Convert text between upper, lower and title case", "text", "text", "📝", ["case", "uppercase", "lowercase", "title", "convert"]),
  tool("remove-duplicates", "Remove Duplicate Lines", "Remove duplicate lines from text", "text", "text", "📝", ["duplicate", "lines", "remove", "dedupe"]),
  tool("sort-lines", "Sort Lines", "Sort lines of text alphabetically", "text", "text", "📝", ["sort", "lines", "alphabetical", "order"]),
  tool("reverse-text", "Reverse Text", "Reverse characters or words in text", "text", "text", "📝", ["reverse", "text", "backwards"]),
  tool("text-diff", "Text Diff Checker", "Compare two texts and highlight differences", "text", "text", "📝", ["text", "diff", "compare", "difference"]),
  tool("word-counter", "Word Counter", "Count words, sentences and paragraphs", "text", "text", "📝", ["word", "count", "counter", "statistics"]),
  tool("char-counter", "Character Counter", "Count characters with and without spaces", "text", "text", "📝", ["character", "count", "counter", "length"]),

  // Date & Time
  tool("unix-timestamp", "Unix Timestamp Converter", "Convert Unix timestamps to readable dates", "developer", "datetime", "🕐", ["unix", "timestamp", "epoch", "date", "time", "convert"]),
  tool("timestamp-generator", "Timestamp Generator", "Generate current or custom Unix timestamps", "developer", "datetime", "🕐", ["timestamp", "generator", "unix", "epoch"]),
  tool("timezone-converter", "Timezone Converter", "Convert dates between time zones", "developer", "datetime", "🕐", ["timezone", "convert", "date", "time", "utc"]),
  tool("date-difference", "Date Difference Calculator", "Calculate the difference between two dates", "developer", "datetime", "🕐", ["date", "difference", "duration", "calculator"]),
  tool("cron-parser", "Cron Expression Parser", "Parse cron expressions into human-readable text", "developer", "datetime", "🕐", ["cron", "parser", "schedule", "expression"]),
  tool("cron-generator", "Cron Expression Generator", "Build cron expressions visually", "developer", "datetime", "🕐", ["cron", "generator", "schedule", "expression"], { isNew: true }),

  // API Tools
  tool("http-header-viewer", "HTTP Header Viewer", "Parse and inspect HTTP request headers", "developer", "api", "🌐", ["http", "header", "request", "viewer"]),
  tool("user-agent-parser", "User Agent Parser", "Parse browser user agent strings", "developer", "api", "🌐", ["user agent", "browser", "parser", "ua"]),
  tool("curl-generator", "CURL Generator", "Generate cURL commands from HTTP requests", "developer", "api", "🌐", ["curl", "generator", "http", "request"]),
  tool("rest-builder", "REST Request Builder", "Build and test REST API requests", "developer", "api", "🌐", ["rest", "api", "request", "builder", "http"]),
  tool("http-status", "HTTP Status Code Lookup", "Look up HTTP status codes and meanings", "developer", "api", "🌐", ["http", "status", "code", "lookup", "reference"]),

  // Network
  tool("ip-lookup", "IP Address Lookup", "Look up IP address geolocation and info", "developer", "network", "📡", ["ip", "address", "lookup", "geolocation"]),
  tool("cidr-calculator", "CIDR Calculator", "Calculate CIDR ranges and subnet masks", "developer", "network", "📡", ["cidr", "subnet", "calculator", "network"]),
  tool("subnet-calculator", "Subnet Calculator", "Calculate subnet details from IP and mask", "developer", "network", "📡", ["subnet", "calculator", "network", "mask"]),
  tool("dns-lookup", "DNS Lookup", "Look up DNS records for any domain", "developer", "network", "📡", ["dns", "lookup", "domain", "records"]),
  tool("port-reference", "Port Number Reference", "Reference common TCP/UDP port numbers", "developer", "network", "📡", ["port", "number", "tcp", "udp", "reference"]),

  // SQL
  tool("sql-formatter", "SQL Formatter", "Format and beautify SQL queries", "developer", "sql", "🗄", ["sql", "formatter", "beautify", "query"], { favorite: true }),
  tool("sql-minifier", "SQL Minifier", "Minify SQL by removing whitespace", "developer", "sql", "🗄", ["sql", "minify", "compress"]),
  tool("sql-beautifier", "SQL Beautifier", "Beautify SQL with proper indentation", "developer", "sql", "🗄", ["sql", "beautifier", "format", "indent"]),

  // HTML/CSS/JS
  tool("html-formatter", "HTML Formatter", "Format and beautify HTML code", "developer", "web", "</>", ["html", "formatter", "beautify"], { isNew: true }),
  tool("css-formatter", "CSS Formatter", "Format and beautify CSS code", "developer", "web", "</>", ["css", "formatter", "beautify"]),
  tool("js-formatter", "JS Formatter", "Format and beautify JavaScript code", "developer", "web", "</>", ["javascript", "js", "formatter", "beautify"]),
  tool("css-minifier", "CSS Minifier", "Minify CSS by removing whitespace", "developer", "web", "</>", ["css", "minify", "compress"], { href: "/css-minifier" }),
  tool("js-minifier", "JS Minifier", "Minify JavaScript code", "developer", "web", "</>", ["javascript", "js", "minify", "compress", "uglify"]),
  tool("html-minifier", "HTML Minifier", "Minify HTML by removing whitespace", "developer", "web", "</>", ["html", "minify", "compress"]),

  // Developer Productivity
  tool("lorem-ipsum", "Lorem Ipsum Generator", "Generate placeholder Lorem Ipsum text", "developer", "productivity", "⚡", ["lorem", "ipsum", "placeholder", "text", "generator"]),
  tool("fake-data", "Fake Data Generator", "Generate realistic fake test data", "developer", "productivity", "⚡", ["fake", "data", "mock", "test", "generator"]),
  tool("random-string", "Random String Generator", "Generate random strings of any length", "developer", "productivity", "⚡", ["random", "string", "generator", "password"]),
  tool("password-generator", "Password Generator", "Generate strong secure passwords", "developer", "productivity", "⚡", ["password", "generator", "secure", "strong"]),
  tool("qr-generator", "QR Code Generator", "Generate QR codes from text or URLs", "developer", "productivity", "⚡", ["qr", "code", "generator", "barcode"]),
  tool("qr-reader", "QR Code Reader", "Decode QR codes from uploaded images", "developer", "productivity", "⚡", ["qr", "code", "reader", "decode", "scan"]),

  // PDF Tools (placeholders)
  tool("pdf-to-word", "PDF to Word", "Convert PDF documents to editable Word files", "pdf", null, "📄", ["pdf", "word", "docx", "convert"], { popular: true }),
  tool("pdf-merger", "Merge PDF", "Combine multiple PDF files into one", "pdf", null, "📄", ["pdf", "merge", "combine", "join"], { popular: true }),
  tool("pdf-splitter", "PDF Splitter", "Split PDF files into separate pages", "pdf", null, "📄", ["pdf", "split", "extract", "pages"]),
  tool("pdf-compressor", "PDF Compressor", "Reduce PDF file size", "pdf", null, "📄", ["pdf", "compress", "reduce", "size"]),

  // Image Tools (placeholders)
  tool("image-compressor", "Image Compressor", "Reduce image file size without losing quality", "image", null, "🖼", ["image", "compress", "optimize", "reduce"], { popular: true }),
  tool("webp-converter", "WebP Converter", "Convert images to and from WebP format", "image", null, "🖼", ["webp", "convert", "image", "png", "jpg"]),
  tool("image-resizer", "Image Resizer", "Resize images to custom dimensions", "image", null, "🖼", ["image", "resize", "scale", "dimensions"]),

  // Converters (placeholders)
  tool("csv-to-json", "CSV to JSON", "Convert CSV data to JSON format", "convert", null, "🔄", ["csv", "json", "convert"]),
  tool("json-to-csv", "JSON to CSV", "Convert JSON data to CSV format", "convert", null, "🔄", ["json", "csv", "convert"]),

  // SEO (placeholders)
  tool("meta-tag-generator", "Meta Tag Generator", "Generate HTML meta tags for SEO", "seo", null, "📈", ["meta", "tag", "seo", "generator"]),
  tool("sitemap-generator", "Sitemap Generator", "Generate XML sitemaps for your website", "seo", null, "📈", ["sitemap", "xml", "seo", "generator"]),

  // AI (placeholders)
  tool("ai-text-summarizer", "AI Text Summarizer", "Summarize long text with AI", "ai", null, "✨", ["ai", "summarize", "text", "summary"]),
  tool("ai-code-explainer", "AI Code Explainer", "Explain code snippets with AI", "ai", null, "✨", ["ai", "code", "explain", "assistant"]),
]

export const popularTools = tools.filter((t) => t.popular)
export const newTools = tools.filter((t) => t.isNew)
export const favoriteTools = tools.filter((t) => t.favorite)

export const heroPopularLinks = [
  "JSON Formatter",
  "Regex Tester",
  "PDF to Word",
  "UUID v4 Generator",
] as const

export function getCategory(id: ToolCategoryId): ToolCategory | undefined {
  return categories.find((c) => c.id === id)
}

export function getGroup(id: ToolGroupId): ToolGroup | undefined {
  return groups.find((g) => g.id === id)
}

export function getToolsByCategory(categoryId: ToolCategoryId): Tool[] {
  return tools.filter((t) => t.category === categoryId)
}

export function getToolsByGroup(groupId: ToolGroupId): Tool[] {
  return tools.filter((t) => t.group === groupId)
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id)
}

export function getToolByName(name: string): Tool | undefined {
  return tools.find((t) => t.name === name)
}

function scoreTool(tool: Tool, q: string): number {
  const name = tool.name.toLowerCase()
  const desc = tool.description.toLowerCase()

  if (name === q) return 100
  if (name.startsWith(q)) return 80
  if (name.includes(q)) return 60
  if (tool.keywords.some((k) => k === q)) return 55
  if (tool.keywords.some((k) => k.startsWith(q))) return 50
  if (tool.keywords.some((k) => k.includes(q))) return 40
  if (desc.includes(q)) return 20
  if (tool.group && tool.group.includes(q)) return 15
  return 0
}

export function searchTools(query: string, limit = 12): Tool[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return tools
    .map((t) => ({ tool: t, score: scoreTool(t, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ tool }) => tool)
}

export function getRelatedTools(toolId: string, limit = 4): Tool[] {
  const current = getToolById(toolId)
  if (!current) return []

  const sameGroup = current.group
    ? tools.filter((t) => t.group === current.group && t.id !== toolId)
    : tools.filter((t) => t.category === current.category && t.id !== toolId)

  return sameGroup.slice(0, limit)
}

export function getToolIdFromHref(href: string): string | undefined {
  const slug = href.replace(/^\//, "")
  return tools.find((t) => t.href === `/${slug}` || t.id === slug)?.id
}
