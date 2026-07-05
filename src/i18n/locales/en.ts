/* =========================================================================
   English locale
   ========================================================================= */

export default {
  app: {
    name: 'Efficiency Toolbox',
    tagline: 'Developer & productivity tools',
    search: {
      placeholder: 'Search tools…',
      shortcut: '⌘K',
    },
    actions: {
      home: 'Home',
      theme: 'Toggle theme',
      themeDark: 'Dark theme',
      themeLight: 'Light theme',
      language: 'Language',
      github: 'View on GitHub',
      inspiredBy: 'Source on GitHub',
      menu: 'Menu',
    },
    nav: {
      favorites: 'Favorites',
      items: {
        home: 'Home',
        hall: 'Tool Hall',
        about: 'About',
        blog: 'Blog',
        feedback: 'Feedback',
      },
    },
  },

  home: {
    hero: {
      eyebrow: 'All client-side · No data leaves your browser',
      title: 'A curated box of {accent}developer tools{accentEnd}, one click away.',
      lead: 'A curated set of {count} hand-built utilities for crypto, conversion, web, network and everyday text work. Fast, offline-capable, with an interface designed to disappear so the work can take stage.',
      stats: {
        tools: 'Working tools',
        categories: 'Categories',
        zeroKb: 'Server calls',
        inBrowser: 'Runs in-browser',
      },
      cta: {
        hall: 'Browse tool hall',
        feedback: 'Send feedback',
      },
      searchPlaceholder: 'Search tools by name or keyword…',
      quickAccess: 'Quick access',
    },
    featured: {
      title: 'Popular tools',
      subtitle: 'The most-used utilities developers reach for',
      more: 'View all',
    },
    badge: {
      hot: 'Popular',
      new: 'New',
    },
    recent: {
      title: 'Recently used',
    },
    categories: {
      title: 'Browse by category',
      subtitle: 'Find what you need across {n} categories',
      browse: 'Browse',
    },
    about: {
      title: 'Why Efficiency Toolbox',
      subtitle: 'Client-side, zero uploads, instant.',
      points: {
        local: { title: 'Fully local', body: 'Every calculation runs in your browser. Your data never leaves the device.' },
        fast: { title: 'Blazing fast', body: 'Statically hosted with lazy loading — usable on first paint, even offline.' },
        open: { title: 'Open source', body: 'Hosted on GitHub. Issues and pull requests welcome.' },
      },
    },
    yourFavorites: 'Your favorites',
    resultsFor: 'Results for "{q}"',
    noResults: {
      title: 'No tools found{q}',
      body: 'Try a different keyword, or browse by category.',
    },
    toolCount: '{n} tool | {n} tools',
    favCount: '{n}',
    count: '{n}',
  },

  hall: {
    title: 'Tool Hall',
    subtitle: 'Browse all {n}+ online tools — find what you need by category.',
    countSuffix: '{n} tools in total',
    all: 'All tools',
    searchPlaceholder: 'Search tools…',
  },

  footer: {
    tagline: '100+ online tools for development, design, study and daily work. All data is processed locally — safe and reliable.',
    columns: {
      product: 'Product',
      support: 'Support',
      about: 'About',
    },
    links: {
      hall: 'Tool Hall',
      changelog: 'Changelog',
      popular: 'Popular tools',
      docs: 'Help docs',
      feedback: 'Feedback',
      about: 'About us',
      privacy: 'Privacy',
      terms: 'Terms',
    },
    social: {
      github: 'GitHub',
      wechat: 'WeChat',
      weibo: 'Weibo',
      x: 'X',
    },
    rights: '© {year} Efficiency Toolbox. All rights reserved.',
    madeWith: 'Crafted with care, for developers',
  },

  tool: {
    favorite: 'Add to favorites',
    unfavorite: 'Remove from favorites',
    comingSoon: {
      title: 'Coming soon',
      body: '{name} is catalogued, but its interactive implementation is not yet wired into this build. Its metadata, search and favorites still work.',
      id: 'id: {id}',
      category: 'category: {cat}',
    },
  },

  notFound: {
    title: '404 — page not found',
    body: "The tool you're looking for doesn't exist here.",
    back: 'Back home',
  },

  pages: {
    about: { body: 'Client-side, zero uploads, instant.' },
    blog: { body: 'We ship continuously — watch this space for release notes.' },
    feedback: { body: 'Found a bug or have an idea? Reach out via the links below.' },
  },

  common: {
    copy: 'Copy',
    copied: 'Copied',
    download: 'Download',
    generate: 'Generate',
    swap: 'Swap',
    clear: 'Clear',
    error: 'Error',
    invalid: 'Invalid input',
    empty: '—',
  },

  categories: {
    Crypto: 'Crypto',
    Converter: 'Converter',
    Web: 'Web',
    'Images & Videos': 'Images & Videos',
    Development: 'Development',
    Network: 'Network',
    Math: 'Math',
    Measurement: 'Measurement',
    Text: 'Text',
    Data: 'Data',
  },

  /* ---------------- Tool metadata (name + description) ---------------- */
  tools: {
    /* Crypto */
    'hash-text': {
      name: 'Hash text',
      description: 'Hash a text string with MD5, SHA-1, SHA-256, SHA-512, SHA-3 or RIPEMD-160.',
    },
    bcrypt: { name: 'Bcrypt', description: 'Hash and compare text strings using the bcrypt password-hashing function.' },
    'uuid-generator': { name: 'UUIDs generator', description: 'Generate Universally Unique Identifiers (v1, v3, v4, v5, nil).' },
    'ulid-generator': { name: 'ULID generator', description: 'Generate Universally Unique Lexicographically Sortable Identifiers.' },
    'token-generator': { name: 'Token generator', description: 'Generate a random string with the chars you want — letters, numbers, symbols.' },
    'hmac-generator': { name: 'HMAC generator', description: 'Compute a hash-based message authentication code (HMAC) with a secret key.' },
    'rsa-key-pair-generator': { name: 'RSA key pair generator', description: 'Generate a random RSA private and public PEM key pair.' },
    'password-strength-analyser': { name: 'Password strength analyser', description: 'Test the strength of a password with a crack-time estimate.' },
    'bip39-generator': { name: 'BIP39 passphrase generator', description: 'Generate a BIP39 mnemonic passphrase.' },
    encryption: { name: 'Encrypt / decrypt text', description: 'Encrypt and decrypt text using AES-GCM with a passphrase.' },

    /* Converter */
    'base64-string-converter': { name: 'Base64 string encoder/decoder', description: 'Simply encode and decode strings into their base64 representation.' },
    'base64-file-converter': { name: 'Base64 file converter', description: 'Convert a file or image into its base64 representation.' },
    'json-prettify': { name: 'JSON prettify & format', description: 'Prettify, minify or validate your JSON into a readable format.' },
    'json-to-yaml': { name: 'JSON ⇄ YAML converter', description: 'Convert between JSON and YAML, live, in both directions.' },
    'json-to-toml': { name: 'JSON ⇄ TOML converter', description: 'Convert between JSON and TOML configuration formats.' },
    'case-converter': { name: 'Case converter', description: 'Transform the case of a string — camel, snake, kebab, pascal, title…' },
    'color-converter': { name: 'Color converter', description: 'Convert color between hex, RGB, HSL and CSS name, with a live preview.' },
    'text-to-binary': { name: 'Text ⇄ ASCII binary', description: 'Convert text to its ASCII binary representation and vice-versa.' },
    'text-to-nato-alphabet': { name: 'Text to NATO alphabet', description: 'Transform text into the NATO phonetic alphabet for oral transmission.' },
    'integer-base-converter': { name: 'Integer base converter', description: 'Convert a number between decimal, hex, binary, octal and base64.' },
    'date-time-converter': { name: 'Date-time converter', description: 'Convert date and time into the various formats — Unix, ISO, custom.' },
    'roman-numeral-converter': { name: 'Roman numeral converter', description: 'Convert Roman numerals to numbers and numbers to Roman numerals.' },
    'yaml-viewer': { name: 'YAML prettify & format', description: 'Prettify your YAML into a friendly, human-readable format.' },

    /* Web */
    'url-encoder': { name: 'URL encode / decode', description: 'Encode text to URL-encoded (percent-encoded) format, or decode from it.' },
    'url-parser': { name: 'URL parser', description: 'Parse a URL into its parts — protocol, host, path, query, hash…' },
    'html-entities': { name: 'Escape HTML entities', description: 'Escape or unescape HTML entities (angle brackets, ampersand, quotes).' },
    'jwt-parser': { name: 'JWT parser', description: 'Parse and inspect a JSON Web Token (header + payload + signature).' },
    'user-agent-parser': { name: 'User-agent parser', description: 'Detect browser, engine, OS and device from an HTTP User-Agent string.' },
    'http-status-codes': { name: 'HTTP status codes', description: 'Browse the full HTTP response status code registry with meanings.' },
    'mime-types': { name: 'MIME types', description: 'Look up MIME types by file extension or name, with both directions.' },
    'keycode-info': { name: 'Keycode info', description: 'Inspect the keycode, key, code and modifiers of any key you press.' },
    'device-information': { name: 'Device info', description: 'Display useful information about your current browsing device.' },
    'basic-auth-generator': { name: 'Basic auth generator', description: 'Generate a Basic Authentication header from a username and password.' },
    'slugify-string': { name: 'Slugify string', description: 'Turn any string into a clean URL-safe slug.' },
    'json-diff': { name: 'JSON diff', description: 'Compare two JSON documents and highlight the differences.' },

    /* Images & Videos */
    'qrcode-generator': { name: 'QR code generator', description: 'Generate and download a QR code from any text or URL.' },
    'wifi-qrcode-generator': { name: 'WiFi QR code generator', description: 'Generate a QR code that auto-joins a WiFi network when scanned.' },
    'svg-placeholder-generator': { name: 'SVG placeholder generator', description: 'Generate customizable SVG placeholder images for mockups.' },

    /* Development */
    'git-memo': { name: 'Git cheatsheet', description: 'A quick reference of the most common Git commands.' },
    'random-port-generator': { name: 'Random port generator', description: 'Generate one or more random valid TCP/UDP port numbers.' },
    'crontab-generator': { name: 'Crontab generator', description: 'Translate a cron expression into a human-readable schedule.' },
    'chmod-calculator': { name: 'Chmod calculator', description: 'Compute Unix file permissions from checkboxes or an octal value.' },
    'regex-tester': { name: 'Regex tester', description: 'Test a regular expression against a text and capture the groups.' },
    'json-minify': { name: 'JSON minify', description: 'Minify a JSON document by removing all unnecessary whitespace.' },
    'sql-prettify': { name: 'SQL prettify', description: 'Format and prettify a SQL query into a readable, indented form.' },
    'docker-run-to-compose': { name: 'docker run → compose', description: 'Convert a docker run command into a docker-compose.yml service.' },

    /* Network */
    'ipv4-subnet-calculator': { name: 'IPv4 subnet calculator', description: 'Compute the network, broadcast, mask and host range of an IPv4 CIDR.' },
    'ipv4-address-converter': { name: 'IPv4 address converter', description: 'Convert an IPv4 address between dotted, decimal, hex and binary.' },
    'mac-address-generator': { name: 'MAC address generator', description: 'Generate random or pattern-based MAC addresses.' },

    /* Math */
    'math-evaluator': { name: 'Math evaluator', description: 'Evaluate mathematical expressions with full operator precedence.' },
    'percentage-calculator': { name: 'Percentage calculator', description: 'Compute percentages, deltas and ratios of any number.' },

    /* Measurement */
    chronometer: { name: 'Chronometer', description: 'A precise stopwatch with laps and millisecond accuracy.' },
    'temperature-converter': { name: 'Temperature converter', description: 'Convert temperatures between Celsius, Fahrenheit and Kelvin.' },

    /* Text */
    'lorem-ipsum-generator': { name: 'Lorem ipsum generator', description: 'Generate paragraphs, sentences or words of placeholder Latin text.' },
    'text-statistics': { name: 'Text statistics', description: 'Count characters, words, lines, sentences and reading time.' },
    'text-diff': { name: 'Text diff', description: 'Compare two text blocks and highlight the differences line by line.' },
    'string-obfuscator': { name: 'String obfuscator', description: 'Obfuscate a string while keeping it reversible.' },
    'list-converter': { name: 'List converter', description: 'Convert a list between comma, tab, newline, pipe and more.' },
    'emoji-picker': { name: 'Emoji picker', description: 'Search and copy any emoji with its codepoint and name.' },
    'numeronym-generator': { name: 'Numeronym generator', description: 'Turn phrases into numeronyms — i18n, a11y, l10n…' },

    /* Data */
    'phone-parser-and-formatter': { name: 'Phone parser', description: 'Parse, validate and format phone numbers in any country.' },
    'iban-validator-and-parser': { name: 'IBAN validator', description: 'Validate an IBAN, decode its country and check the checksum.' },
  },

  /* ---------------- Tool implementations (in-tool UI strings) -------- */
  impl: {
    'hash-text': {
      textLabel: 'Text to hash',
      placeholder: 'Type or paste text…',
      algorithm: 'Algorithm',
      uppercase: 'Uppercase',
      digest: 'Digest (hex)',
      sha3Missing: 'SHA-3 library not loaded.',
    },
    'uuid-generator': {
      generate: 'Generate',
      generate5: 'Generate 5',
      uppercase: 'Uppercase',
      hyphens: 'Hyphens',
      hint: 'v4 · RFC 4122',
    },
    'base64-string-converter': {
      encode: 'Text to encode',
      decode: 'Base64 to decode',
      outEncode: 'Base64 output',
      outDecode: 'Decoded text',
      phEncode: 'Type text to encode…',
      phDecode: 'Paste base64 to decode…',
      invalid: 'Invalid base64 input.',
    },
    'json-prettify': {
      input: 'Your JSON',
      placeholder: 'Paste JSON here…',
      indent: 'Indent',
      minify: 'Minify',
      output: 'Output',
      empty: 'Input is empty.',
    },
    'date-time-converter': {
      input: 'Date / time',
      placeholder: 'e.g. 2025-01-15T13:45:30Z',
      formats: 'Formats',
      unixSeconds: 'Unix (seconds)',
      unixMs: 'Unix (ms)',
      iso: 'ISO 8601',
      rfc: 'RFC 1123',
      local: 'Local',
      dateOnly: 'Date only',
      timeOnly: 'Time only',
      relative: 'Relative',
      invalid: 'Invalid date.',
    },
    'jwt-parser': {
      input: 'JWT token',
      placeholder: 'Paste your JWT here…',
      header: 'Header',
      payload: 'Payload',
      signature: 'Signature',
      invalid: 'Invalid JWT.',
    },
    'http-status-codes': {
      search: 'Filter by code or name…',
      code: 'Code',
      name: 'Name',
      desc: 'Description',
      noMatch: 'No status codes match your filter.',
    },
    'json-diff': {
      leftLabel: 'Left JSON',
      rightLabel: 'Right JSON',
      placeholder: 'Paste JSON…',
      identical: 'Documents are identical.',
    },
    'qrcode-generator': {
      value: 'Value',
      placeholder: 'Text or URL to encode…',
      size: 'Size',
      level: 'Error correction',
      foreground: 'Foreground',
      background: 'Background',
      download: 'Download PNG',
      invalid: 'Input is empty.',
    },
    'regex-tester': {
      pattern: 'Regular expression',
      flags: 'Flags',
      textLabel: 'Test string',
      textPlaceholder: 'Text to match against…',
      outputLabel: 'Highlighted matches',
      matches: '{n} match | {n} matches',
      noMatch: 'No matches.',
      invalidRegex: 'Invalid regular expression.',
    },
    'crontab-generator': {
      input: 'Cron expression',
      placeholder: 'e.g. */5 * * * *',
      human: 'Human-readable',
      examples: 'Examples',
      invalid: 'Invalid cron expression.',
    },
    'chmod-calculator': {
      owner: 'Owner',
      group: 'Group',
      others: 'Others',
      read: 'read',
      write: 'write',
      execute: 'execute',
      octal: 'Octal',
      symbolic: 'Symbolic',
      command: 'Shell command',
    },
    'ipv4-subnet-calculator': {
      input: 'CIDR',
      placeholder: 'e.g. 192.168.1.0/24',
      network: 'Network address',
      broadcast: 'Broadcast address',
      mask: 'Subnet mask',
      wildcard: 'Wildcard mask',
      firstHost: 'First host',
      lastHost: 'Last host',
      totalHosts: 'Total usable hosts',
      cidrNotation: 'CIDR notation',
      ipClass: 'IP class',
      invalid: 'Invalid IPv4 CIDR.',
    },
    'math-evaluator': {
      input: 'Expression',
      placeholder: 'e.g. 2 + 3 * (4 - 1)',
      result: 'Result',
      invalid: 'Invalid expression.',
    },
    'temperature-converter': {
      input: 'Temperature',
      celsius: 'Celsius (°C)',
      fahrenheit: 'Fahrenheit (°F)',
      kelvin: 'Kelvin (K)',
      invalid: 'Enter a valid number.',
    },
    'emoji-picker': {
      search: 'Search emoji by name…',
      clickHint: 'Click an emoji to see its details.',
      noMatch: 'No matches.',
      decimal: 'decimal',
      copyEmoji: 'Copy emoji',
      copyCode: 'Copy codepoint',
    },
    'iban-validator-and-parser': {
      input: 'IBAN',
      placeholder: 'e.g. GB82 WEST 1234 5698 7654 32',
      valid: 'Valid IBAN',
      invalid: 'Invalid IBAN',
      country: 'Country',
      bban: 'BBAN',
      checksum: 'Checksum',
      formatted: 'Formatted',
    },
  },
}
