/* =========================================================================
   IT-Tools · Catalog
   Each tool: { id, name, path, description, keywords, category, icon }
   Tools with `impl` set are fully working; others show a "coming soon" panel
   but still appear in the catalog (preserving the navigation density).
   ========================================================================= */

export const catalog = [
  /* ---------------- Crypto ---------------- */
  { id: "hash-text", name: "Hash text", path: "/hash-text", category: "Crypto", icon: "hash",
    description: "Hash a text string with MD5, SHA-1, SHA-256, SHA-512, SHA-3 or RIPEMD-160.",
    keywords: ["hash","digest","md5","sha1","sha256","sha512","sha3","ripemd","crypto"], impl: true },
  { id: "bcrypt", name: "Bcrypt", path: "/bcrypt", category: "Crypto", icon: "lock",
    description: "Hash and compare text strings using the bcrypt password-hashing function.",
    keywords: ["bcrypt","password","hash","salt"], impl: true },
  { id: "uuid-generator", name: "UUIDs generator", path: "/uuid-generator", category: "Crypto", icon: "fingerprint",
    description: "Generate Universally Unique Identifiers (v1, v3, v4, v5, nil).",
    keywords: ["uuid","v4","v1","v3","v5","random","identifier","guid"], impl: true },
  { id: "ulid-generator", name: "ULID generator", path: "/ulid-generator", category: "Crypto", icon: "hashSquare",
    description: "Generate Universally Unique Lexicographically Sortable Identifiers.",
    keywords: ["ulid","sortable","unique","id","identifier"], impl: true },
  { id: "token-generator", name: "Token generator", path: "/token-generator", category: "Crypto", icon: "key",
    description: "Generate a random string with the chars you want — letters, numbers, symbols.",
    keywords: ["token","random","string","password","secret"], impl: true },
  { id: "hmac-generator", name: "HMAC generator", path: "/hmac-generator", category: "Crypto", icon: "eyeOff",
    description: "Compute a hash-based message authentication code (HMAC) with a secret key.",
    keywords: ["hmac","hash","mac","secret","signature","sha256"], impl: true },
  { id: "rsa-key-pair-generator", name: "RSA key pair generator", path: "/rsa-key-pair-generator", category: "Crypto", icon: "key",
    description: "Generate a random RSA private and public PEM key pair.",
    keywords: ["rsa","pem","key","pair","public","private","crypto","webcrypto"], impl: true },
  { id: "password-strength-analyser", name: "Password strength analyser", path: "/password-strength-analyser", category: "Crypto", icon: "password",
    description: "Test the strength of a password with a crack-time estimate.",
    keywords: ["password","strength","entropy","crack","security","zxcvbn"], impl: true },
  { id: "bip39-generator", name: "BIP39 passphrase generator", path: "/bip39-generator", category: "Crypto", icon: "discord",
    description: "Generate a BIP39 mnemonic passphrase.",
    keywords: ["bip39","mnemonic","seed","wallet","crypto","bitcoin","ethereum"], impl: true },
  { id: "encryption", name: "Encrypt / decrypt text", path: "/encryption", category: "Crypto", icon: "lock",
    description: "Encrypt and decrypt text using AES-GCM with a passphrase.",
    keywords: ["encrypt","decrypt","aes","gcm","cipher","crypto"], impl: true },

  /* ---------------- Converter ---------------- */
  { id: "base64-string-converter", name: "Base64 string encoder/decoder", path: "/base64-string-converter", category: "Converter", icon: "binary",
    description: "Simply encode and decode strings into their base64 representation.",
    keywords: ["base64","encode","decode","atob","btoa"], impl: true },
  { id: "base64-file-converter", name: "Base64 file converter", path: "/base64-file-converter", category: "Converter", icon: "fileCode",
    description: "Convert a file or image into its base64 representation.",
    keywords: ["base64","file","image","data-uri","convert"], impl: true },
  { id: "json-prettify", name: "JSON prettify & format", path: "/json-prettify", category: "Converter", icon: "braces",
    description: "Prettify, minify or validate your JSON into a readable format.",
    keywords: ["json","prettify","format","beautify","minify","validate"], impl: true },
  { id: "json-to-yaml", name: "JSON ⇄ YAML converter", path: "/json-to-yaml", category: "Converter", icon: "fileCode",
    description: "Convert between JSON and YAML, live, in both directions.",
    keywords: ["json","yaml","convert","yml"], impl: true },
  { id: "json-to-toml", name: "JSON ⇄ TOML converter", path: "/json-to-toml", category: "Converter", icon: "fileCode",
    description: "Convert between JSON and TOML configuration formats.",
    keywords: ["json","toml","convert","config"], impl: true },
  { id: "case-converter", name: "Case converter", path: "/case-converter", category: "Converter", icon: "caseIcon",
    description: "Transform the case of a string — camel, snake, kebab, pascal, title…",
    keywords: ["case","camel","snake","kebab","pascal","title","upper","lower"], impl: true },
  { id: "color-converter", name: "Color converter", path: "/color-converter", category: "Converter", icon: "palette",
    description: "Convert color between hex, RGB, HSL and CSS name, with a live preview.",
    keywords: ["color","hex","rgb","hsl","css","convert"], impl: true },
  { id: "text-to-binary", name: "Text ⇄ ASCII binary", path: "/text-to-binary", category: "Converter", icon: "binary",
    description: "Convert text to its ASCII binary representation and vice-versa.",
    keywords: ["binary","ascii","text","bits","0","1"], impl: true },
  { id: "text-to-nato-alphabet", name: "Text to NATO alphabet", path: "/text-to-nato-alphabet", category: "Converter", icon: "nato",
    description: "Transform text into the NATO phonetic alphabet for oral transmission.",
    keywords: ["nato","phonetic","alphabet","alpha","bravo","charlie"], impl: true },
  { id: "integer-base-converter", name: "Integer base converter", path: "/integer-base-converter", category: "Converter", icon: "hashSquare",
    description: "Convert a number between decimal, hex, binary, octal and base64.",
    keywords: ["base","decimal","hex","binary","octal","radix","number"], impl: true },
  { id: "date-time-converter", name: "Date-time converter", path: "/date-time-converter", category: "Converter", icon: "calendar",
    description: "Convert date and time into the various formats — Unix, ISO, custom.",
    keywords: ["date","time","unix","iso","timestamp","epoch","convert"], impl: true },
  { id: "roman-numeral-converter", name: "Roman numeral converter", path: "/roman-numeral-converter", category: "Converter", icon: "roman",
    description: "Convert Roman numerals to numbers and numbers to Roman numerals.",
    keywords: ["roman","numeral","xiv","convert"], impl: true },
  { id: "yaml-viewer", name: "YAML prettify & format", path: "/yaml-viewer", category: "Converter", icon: "fileCode",
    description: "Prettify your YAML into a friendly, human-readable format.",
    keywords: ["yaml","prettify","format","yml"], impl: true },

  /* ---------------- Web ---------------- */
  { id: "url-encoder", name: "URL encode / decode", path: "/url-encoder", category: "Web", icon: "link",
    description: "Encode text to URL-encoded (percent-encoded) format, or decode from it.",
    keywords: ["url","encode","decode","percent","uri","component"], impl: true },
  { id: "url-parser", name: "URL parser", path: "/url-parser", category: "Web", icon: "globe",
    description: "Parse a URL into its parts — protocol, host, path, query, hash…",
    keywords: ["url","parse","query","params","search","hash"], impl: true },
  { id: "html-entities", name: "Escape HTML entities", path: "/html-entities", category: "Web", icon: "code",
    description: "Escape or unescape HTML entities (replace <, >, &, \" and ').",
    keywords: ["html","entities","escape","unescape","encode","decode"], impl: true },
  { id: "jwt-parser", name: "JWT parser", path: "/jwt-parser", category: "Web", icon: "key",
    description: "Parse and decode a JSON Web Token (JWT) and display its contents.",
    keywords: ["jwt","json","web","token","auth","bearer","decode"], impl: true },
  { id: "user-agent-parser", name: "User-agent parser", path: "/user-agent-parser", category: "Web", icon: "smartphone",
    description: "Detect browser, engine, OS and device from a user-agent string.",
    keywords: ["user","agent","browser","os","device","parse"], impl: true },
  { id: "http-status-codes", name: "HTTP status codes", path: "/http-status-codes", category: "Web", icon: "httpStatus",
    description: "The list of all HTTP status codes, their name and meaning.",
    keywords: ["http","status","code","200","404","500","response"], impl: true },
  { id: "mime-types", name: "MIME types", path: "/mime-types", category: "Web", icon: "fileCode",
    description: "Convert MIME types to file extensions and vice-versa.",
    keywords: ["mime","type","content","extension","file"], impl: true },
  { id: "keycode-info", name: "Keycode info", path: "/keycode-info", category: "Web", icon: "keyboard",
    description: "Find the JavaScript keycode, code and modifiers of any pressed key.",
    keywords: ["key","keycode","keyboard","event","press"], impl: true },
  { id: "device-information", name: "Device information", path: "/device-information", category: "Web", icon: "smartphone",
    description: "Get information about your current device — screen, pixel ratio, user agent…",
    keywords: ["device","screen","resolution","pixel","ua","information"], impl: true },
  { id: "basic-auth-generator", name: "Basic auth generator", path: "/basic-auth-generator", category: "Web", icon: "lock",
    description: "Generate a base64 Basic-Auth header from a username and password.",
    keywords: ["basic","auth","header","base64","authorization"], impl: true },
  { id: "slugify-string", name: "Slugify string", path: "/slugify-string", category: "Web", icon: "tagIcon",
    description: "Make a string URL-, filename- and ID-safe.",
    keywords: ["slug","slugify","url","safe","kebab","filename"], impl: true },
  { id: "json-diff", name: "JSON diff", path: "/json-diff", category: "Web", icon: "diff",
    description: "Compare two JSON objects and see the differences between them.",
    keywords: ["json","diff","compare","delta"], impl: true },

  /* ---------------- Images & Videos ---------------- */
  { id: "qrcode-generator", name: "QR Code generator", path: "/qrcode-generator", category: "Images & Videos", icon: "qrCode",
    description: "Generate and download a QR code for a URL or text, with custom colors.",
    keywords: ["qr","code","generator","square","url","link"], impl: true },
  { id: "wifi-qrcode-generator", name: "WiFi QR Code generator", path: "/wifi-qrcode-generator", category: "Images & Videos", icon: "wifi",
    description: "Generate a QR code for quick connections to WiFi networks.",
    keywords: ["wifi","qr","code","network","ssid","connect"], impl: true },
  { id: "svg-placeholder-generator", name: "SVG placeholder generator", path: "/svg-placeholder-generator", category: "Images & Videos", icon: "image",
    description: "Generate SVG images to use as placeholders in your applications.",
    keywords: ["svg","placeholder","image","mock","generate"], impl: true },

  /* ---------------- Development ---------------- */
  { id: "git-memo", name: "Git cheatsheet", path: "/git-memo", category: "Development", icon: "fileText",
    description: "Quick access to the most common git commands.",
    keywords: ["git","cheatsheet","commands","reference","memo"], impl: true },
  { id: "random-port-generator", name: "Random port generator", path: "/random-port-generator", category: "Development", icon: "ethernet",
    description: "Generate random port numbers outside the range of well-known ports.",
    keywords: ["port","random","network","generate"], impl: true },
  { id: "crontab-generator", name: "Crontab generator", path: "/crontab-generator", category: "Development", icon: "clock",
    description: "Validate a crontab and get a human-readable description of the schedule.",
    keywords: ["cron","crontab","schedule","定时","generator"], impl: true },
  { id: "chmod-calculator", name: "Chmod calculator", path: "/chmod-calculator", category: "Development", icon: "lock",
    description: "Compute your chmod permissions and commands.",
    keywords: ["chmod","permission","unix","linux","rwx","octal"], impl: true },
  { id: "regex-tester", name: "Regex tester", path: "/regex-tester", category: "Development", icon: "code",
    description: "Test, debug and explore regular expressions with live matches.",
    keywords: ["regex","regexp","regular","expression","match","test","pattern"], impl: true },
  { id: "json-minify", name: "JSON minify", path: "/json-minify", category: "Development", icon: "braces",
    description: "Minify and compress your JSON by removing unnecessary whitespace.",
    keywords: ["json","minify","compress","whitespace"], impl: true },
  { id: "sql-prettify", name: "SQL prettify", path: "/sql-prettify", category: "Development", icon: "fileCode",
    description: "Format and prettify your SQL queries.",
    keywords: ["sql","prettify","format","query","beautify"], impl: true },
  { id: "docker-run-to-compose", name: "Docker run → compose", path: "/docker-run-to-compose", category: "Development", icon: "fileCode",
    description: "Transform a \"docker run\" command into a docker-compose file.",
    keywords: ["docker","compose","run","convert","yaml"], impl: true },

  /* ---------------- Network ---------------- */
  { id: "ipv4-subnet-calculator", name: "IPv4 subnet calculator", path: "/ipv4-subnet-calculator", category: "Network", icon: "network",
    description: "Parse an IPv4 CIDR block and get all the info about the subnet.",
    keywords: ["ipv4","subnet","cidr","network","mask","calculator"], impl: true },
  { id: "ipv4-address-converter", name: "IPv4 address converter", path: "/ipv4-address-converter", category: "Network", icon: "ethernet",
    description: "Convert an IP into decimal, binary, hexadecimal or IPv6 form.",
    keywords: ["ipv4","ip","convert","binary","hex","decimal"], impl: true },
  { id: "mac-address-generator", name: "MAC address generator", path: "/mac-address-generator", category: "Network", icon: "ethernet",
    description: "Generate MAC addresses with a chosen prefix and case.",
    keywords: ["mac","address","generate","network","oui"], impl: true },

  /* ---------------- Math ---------------- */
  { id: "math-evaluator", name: "Math evaluator", path: "/math-evaluator", category: "Math", icon: "calculator",
    description: "A calculator for math expressions — sqrt, cos, sin, abs, log, pow…",
    keywords: ["math","evaluator","calculator","expression","sqrt","cos","sin"], impl: true },
  { id: "percentage-calculator", name: "Percentage calculator", path: "/percentage-calculator", category: "Math", icon: "percent",
    description: "Calculate percentages from a value, or a value from a percentage.",
    keywords: ["percentage","percent","calc","ratio"], impl: true },

  /* ---------------- Measurement ---------------- */
  { id: "chronometer", name: "Chronometer", path: "/chronometer", category: "Measurement", icon: "clock",
    description: "A precise stopwatch with lap timing.",
    keywords: ["chrono","stopwatch","timer","time","duration","lap"], impl: true },
  { id: "temperature-converter", name: "Temperature converter", path: "/temperature-converter", category: "Measurement", icon: "thermometer",
    description: "Convert between Kelvin, Celsius, Fahrenheit, Rankine and more.",
    keywords: ["temperature","convert","celsius","fahrenheit","kelvin"], impl: true },

  /* ---------------- Text ---------------- */
  { id: "lorem-ipsum-generator", name: "Lorem ipsum generator", path: "/lorem-ipsum-generator", category: "Text", icon: "alignLeft",
    description: "Generate placeholder Lorem Ipsum text by paragraphs, sentences or words.",
    keywords: ["lorem","ipsum","placeholder","text","dummy","generate"], impl: true },
  { id: "text-statistics", name: "Text statistics", path: "/text-statistics", category: "Text", icon: "sigma",
    description: "Get character, word, line and byte counts for any text.",
    keywords: ["text","statistics","count","characters","words","lines","bytes"], impl: true },
  { id: "text-diff", name: "Text diff", path: "/text-diff", category: "Text", icon: "diff",
    description: "Compare two texts and highlight the line-by-line differences.",
    keywords: ["text","diff","compare","difference"], impl: true },
  { id: "string-obfuscator", name: "String obfuscator", path: "/string-obfuscator", category: "Text", icon: "eyeOff",
    description: "Obfuscate a string (a secret, IBAN or token) so it stays shareable.",
    keywords: ["obfuscate","mask","redact","string","secret","iban"], impl: true },
  { id: "list-converter", name: "List converter", path: "/list-converter", category: "Text", icon: "alignLeft",
    description: "Process column-based data — transpose, prefix, suffix, sort, dedupe…",
    keywords: ["list","column","transpose","prefix","suffix","sort","dedupe"], impl: true },
  { id: "emoji-picker", name: "Emoji picker", path: "/emoji-picker", category: "Text", icon: "smile",
    description: "Copy emojis and get their unicode and code points.",
    keywords: ["emoji","picker","unicode","copy"], impl: true },
  { id: "numeronym-generator", name: "Numeronym generator", path: "/numeronym-generator", category: "Text", icon: "caseIcon",
    description: "A numeronym abbreviates a word by counting its middle letters (i18n).",
    keywords: ["numeronym","abbreviation","i18n","l10n","a11y"], impl: true },

  /* ---------------- Data ---------------- */
  { id: "phone-parser-and-formatter", name: "Phone parser & formatter", path: "/phone-parser-and-formatter", category: "Data", icon: "phone",
    description: "Parse, validate and format phone numbers with country info.",
    keywords: ["phone","number","parse","format","validate","country"], impl: true },
  { id: "iban-validator-and-parser", name: "IBAN validator & parser", path: "/iban-validator-and-parser", category: "Data", icon: "creditCard",
    description: "Validate an IBAN and get country, BBAN and check digits.",
    keywords: ["iban","bank","validate","parse","account","check"], impl: true },
];

// Group by category, preserving insertion order
export const categories = (() => {
  const out = [];
  const seen = new Set();
  for (const t of catalog) {
    if (!seen.has(t.category)) { seen.add(t.category); out.push(t.category); }
  }
  return out;
})();

export function toolsByCategory(cat) {
  return catalog.filter(t => t.category === cat);
}

export function findTool(path) {
  return catalog.find(t => t.path === path || t.id === path);
}
