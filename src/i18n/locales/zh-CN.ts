/* =========================================================================
   中文（简体）locale
   ========================================================================= */

export default {
  app: {
    name: 'it·tools',
    tagline: '在线开发与效率工具',
    search: {
      placeholder: '搜索工具…',
      shortcut: '⌘K',
    },
    actions: {
      home: '首页',
      theme: '切换主题',
      themeDark: '深色主题',
      themeLight: '浅色主题',
      language: '语言',
      github: '在 GitHub 查看',
      inspiredBy: '在 GitHub 查看源码',
      menu: '菜单',
    },
    nav: {
      favorites: '收藏',
      items: {
        home: '首页',
        hall: '工具大厅',
        about: '关于我们',
        blog: '博客',
        feedback: '留言反馈',
      },
    },
  },

  home: {
    hero: {
      eyebrow: '全程浏览器本地运行 · 不上传任何数据',
      title: '一盒精选的{accent}开发者工具{accentEnd}，触手可及。',
      lead: '深受喜爱的 it-tools 的重构版 —— {count} 个亲手打造的实用工具，覆盖加密、转换、Web、网络与日常文本处理。快速、可离线，界面刻意隐去，让真正的工作成为主角。',
      stats: {
        tools: '可用工具',
        categories: '工具分类',
        zeroKb: '服务端请求',
        inBrowser: '浏览器内运行',
      },
      cta: {
        hall: '进入工具大厅',
        feedback: '留言反馈',
      },
      searchPlaceholder: '搜索工具名称或关键词…',
      quickAccess: '快捷入口',
    },
    featured: {
      title: '热门工具',
      subtitle: '开发者最常用的效率利器',
      more: '查看全部',
    },
    badge: {
      hot: '热门',
      new: '新增',
    },
    recent: {
      title: '最近使用',
    },
    categories: {
      title: '按分类浏览',
      subtitle: '从 {n} 个分类中快速找到所需工具',
      browse: '浏览',
    },
    about: {
      title: '为什么选择 it·tools',
      subtitle: '纯前端、零上传、即开即用。',
      points: {
        local: { title: '全程本地处理', body: '所有计算在浏览器内完成，数据不出本机，安全可靠。' },
        fast: { title: '极速响应', body: '静态托管 + 懒加载，首屏即可使用，离线也能跑。' },
        open: { title: '开源透明', body: '代码托管在 GitHub，欢迎提交 Issue 与 PR。' },
      },
    },
    yourFavorites: '你的收藏',
    resultsFor: '“{q}” 的搜索结果',
    noResults: {
      title: '未找到相关工具{q}',
      body: '换个关键词试试，或按分类浏览。',
    },
    toolCount: '{n} 个工具',
    favCount: '{n}',
    count: '{n}',
  },

  hall: {
    title: '工具大厅',
    subtitle: '浏览全部 {n}+ 在线工具，按分类快速找到你需要的。',
    countSuffix: '共 {n} 个工具',
    all: '全部工具',
    searchPlaceholder: '搜索工具…',
  },

  footer: {
    tagline: '100+ 在线工具，满足开发、设计、学习和日常工作需求。所有数据本地处理，安全可靠。',
    columns: {
      product: '产品',
      support: '支持',
      about: '关于我们',
    },
    links: {
      hall: '工具大厅',
      changelog: '更新日志',
      popular: '热门工具',
      docs: '帮助文档',
      feedback: '留言反馈',
      about: '关于我们',
      privacy: '隐私政策',
      terms: '使用条款',
    },
    social: {
      github: 'GitHub',
      wechat: 'WeChat',
      weibo: 'Weibo',
      x: 'X',
    },
    rights: '© {year} it·tools. 保留所有权利。',
    madeWith: '用心打造，为开发者服务',
  },

  tool: {
    favorite: '添加到收藏',
    unfavorite: '从收藏移除',
    comingSoon: {
      title: '即将推出',
      body: '{name} 已编入目录，但本次重构尚未接入其交互实现。元数据、搜索与收藏功能均可正常使用。',
      id: 'id：{id}',
      category: '分类：{cat}',
    },
  },

  notFound: {
    title: '404 — 页面未找到',
    body: '你要找的工具不在这里。',
    back: '返回首页',
  },

  common: {
    copy: '复制',
    copied: '已复制',
    download: '下载',
    generate: '生成',
    swap: '交换',
    clear: '清空',
    error: '错误',
    invalid: '输入无效',
    empty: '—',
  },

  categories: {
    Crypto: '加密',
    Converter: '转换',
    Web: 'Web',
    'Images & Videos': '图像与视频',
    Development: '开发',
    Network: '网络',
    Math: '数学',
    Measurement: '度量',
    Text: '文本',
    Data: '数据',
  },

  /* ---------------- 工具元数据（名称 + 描述） ---------------- */
  tools: {
    /* 加密 */
    'hash-text': { name: '文本哈希', description: '使用 MD5、SHA-1、SHA-256、SHA-512、SHA-3 或 RIPEMD-160 计算文本摘要。' },
    bcrypt: { name: 'Bcrypt', description: '使用 bcrypt 口令哈希函数对文本进行哈希与比对。' },
    'uuid-generator': { name: 'UUID 生成器', description: '生成通用唯一标识符（v1、v3、v4、v5、nil）。' },
    'ulid-generator': { name: 'ULID 生成器', description: '生成字典序可排序的通用唯一标识符。' },
    'token-generator': { name: '令牌生成器', description: '按需选择字母、数字、符号，生成随机字符串。' },
    'hmac-generator': { name: 'HMAC 生成器', description: '使用密钥计算基于哈希的消息认证码（HMAC）。' },
    'rsa-key-pair-generator': { name: 'RSA 密钥对生成器', description: '生成一对随机的 RSA 私钥与公钥（PEM 格式）。' },
    'password-strength-analyser': { name: '密码强度分析', description: '估算密码强度并给出破解所需时间。' },
    'bip39-generator': { name: 'BIP39 助记词生成器', description: '生成 BIP39 助记词。' },
    encryption: { name: '文本加密 / 解密', description: '使用 AES-GCM 与口令对文本进行加解密。' },

    /* 转换 */
    'base64-string-converter': { name: 'Base64 字符串编解码', description: '在字符串与其 Base64 表示之间互相转换。' },
    'base64-file-converter': { name: 'Base64 文件转换器', description: '将文件或图片转换为 Base64 表示。' },
    'json-prettify': { name: 'JSON 美化与格式化', description: '将 JSON 美化、压缩或校验为可读格式。' },
    'json-to-yaml': { name: 'JSON ⇄ YAML 转换', description: '在 JSON 与 YAML 之间双向实时转换。' },
    'json-to-toml': { name: 'JSON ⇄ TOML 转换', description: '在 JSON 与 TOML 配置格式之间互相转换。' },
    'case-converter': { name: '大小写转换', description: '转换字符串大小写：驼峰、蛇形、短横、帕斯卡、标题等。' },
    'color-converter': { name: '颜色转换', description: '在 hex、RGB、HSL 与 CSS 命名色之间转换，带实时预览。' },
    'text-to-binary': { name: '文本 ⇄ ASCII 二进制', description: '在文本与其 ASCII 二进制表示之间互相转换。' },
    'text-to-nato-alphabet': { name: '文本转北约音标', description: '将文本转换为北约音标字母，便于口头传达。' },
    'integer-base-converter': { name: '整数进制转换', description: '在十进制、十六进制、二进制、八进制、base64 之间转换数字。' },
    'date-time-converter': { name: '日期时间转换', description: '在多种格式间转换日期时间 —— Unix、ISO、自定义等。' },
    'roman-numeral-converter': { name: '罗马数字转换', description: '在罗马数字与阿拉伯数字之间互相转换。' },
    'yaml-viewer': { name: 'YAML 美化与格式化', description: '将 YAML 美化为易读的格式。' },

    /* Web */
    'url-encoder': { name: 'URL 编解码', description: '将文本编码为 URL（百分号）编码，或从中解码。' },
    'url-parser': { name: 'URL 解析器', description: '将 URL 拆解为协议、主机、路径、查询、锚点等部分。' },
    'html-entities': { name: 'HTML 实体转义', description: '对 HTML 实体进行转义与反转义（尖括号、&、引号等）。' },
    'jwt-parser': { name: 'JWT 解析器', description: '解析并查看 JSON Web Token（头部 + 负载 + 签名）。' },
    'user-agent-parser': { name: 'User-agent 解析器', description: '从 HTTP User-Agent 字符串识别浏览器、引擎、系统与设备。' },
    'http-status-codes': { name: 'HTTP 状态码', description: '浏览完整的 HTTP 响应状态码列表及含义。' },
    'mime-types': { name: 'MIME 类型', description: '按扩展名或名称查询 MIME 类型，支持双向查询。' },
    'keycode-info': { name: '键码信息', description: '查看任意按键的 keycode、key、code 与修饰键状态。' },
    'device-information': { name: '设备信息', description: '显示当前浏览设备的实用信息。' },
    'basic-auth-generator': { name: 'Basic 认证生成器', description: '从用户名与密码生成 Basic 认证请求头。' },
    'slugify-string': { name: 'Slug 生成器', description: '将任意字符串转为干净的 URL 安全 slug。' },
    'json-diff': { name: 'JSON 差异对比', description: '对比两份 JSON 文档并高亮差异。' },

    /* 图像与视频 */
    'qrcode-generator': { name: '二维码生成器', description: '从任意文本或 URL 生成并下载二维码。' },
    'wifi-qrcode-generator': { name: 'WiFi 二维码生成器', description: '生成扫码即可自动连接 WiFi 的二维码。' },
    'svg-placeholder-generator': { name: 'SVG 占位图生成器', description: '生成可定制的 SVG 占位图，用于原型设计。' },

    /* 开发 */
    'git-memo': { name: 'Git 速查表', description: '常用 Git 命令的快速参考。' },
    'random-port-generator': { name: '随机端口生成器', description: '随机生成一个或多个有效的 TCP/UDP 端口号。' },
    'crontab-generator': { name: 'Cron 表达式生成器', description: '将 cron 表达式翻译成可读的执行计划。' },
    'chmod-calculator': { name: 'Chmod 计算器', description: '通过勾选或八进制值计算 Unix 文件权限。' },
    'regex-tester': { name: '正则表达式测试', description: '针对文本测试正则表达式并捕获分组。' },
    'json-minify': { name: 'JSON 压缩', description: '移除多余空白，压缩 JSON 文档。' },
    'sql-prettify': { name: 'SQL 美化', description: '将 SQL 查询格式化为可读的缩进形式。' },
    'docker-run-to-compose': { name: 'docker run → compose', description: '将 docker run 命令转换为 docker-compose.yml 服务。' },

    /* 网络 */
    'ipv4-subnet-calculator': { name: 'IPv4 子网计算器', description: '计算 IPv4 CIDR 的网络号、广播地址、掩码与主机范围。' },
    'ipv4-address-converter': { name: 'IPv4 地址转换', description: '在点分、十进制、十六进制、二进制之间转换 IPv4 地址。' },
    'mac-address-generator': { name: 'MAC 地址生成器', description: '按随机或模板生成 MAC 地址。' },

    /* 数学 */
    'math-evaluator': { name: '数学表达式求值', description: '按完整运算优先级对数学表达式求值。' },
    'percentage-calculator': { name: '百分比计算器', description: '计算任意数值的百分比、增量和比例。' },

    /* 度量 */
    chronometer: { name: '秒表', description: '带圈数记录与毫秒精度的精准秒表。' },
    'temperature-converter': { name: '温度转换', description: '在摄氏度、华氏度与开尔文之间转换温度。' },

    /* 文本 */
    'lorem-ipsum-generator': { name: 'Lorem ipsum 生成器', description: '生成段、句或词的占位拉丁文。' },
    'text-statistics': { name: '文本统计', description: '统计字符数、单词数、行数、句数与阅读时长。' },
    'text-diff': { name: '文本差异对比', description: '逐行对比两段文本并高亮差异。' },
    'string-obfuscator': { name: '字符串混淆器', description: '对字符串进行可逆混淆。' },
    'list-converter': { name: '列表转换器', description: '在逗号、制表、换行、竖线等格式间转换列表。' },
    'emoji-picker': { name: 'Emoji 选择器', description: '搜索并复制任意 emoji，含码位与名称。' },
    'numeronym-generator': { name: '缩略数字词生成器', description: '将短语转为缩略数字词 —— i18n、a11y、l10n…' },

    /* 数据 */
    'phone-parser-and-formatter': { name: '电话号码解析器', description: '解析、校验并格式化任意国家的电话号码。' },
    'iban-validator-and-parser': { name: 'IBAN 校验器', description: '校验 IBAN，解码其国家代码并检查校验位。' },
  },

  /* ---------------- 工具实现（工具内界面文案） ---------------- */
  impl: {
    'hash-text': {
      textLabel: '要哈希的文本',
      placeholder: '输入或粘贴文本…',
      algorithm: '算法',
      uppercase: '大写',
      digest: '摘要（十六进制）',
      sha3Missing: 'SHA-3 库未加载。',
    },
    'uuid-generator': {
      generate: '生成',
      generate5: '生成 5 个',
      uppercase: '大写',
      hyphens: '连字符',
      hint: 'v4 · RFC 4122',
    },
    'base64-string-converter': {
      encode: '要编码的文本',
      decode: '要解码的 Base64',
      outEncode: 'Base64 输出',
      outDecode: '解码后的文本',
      phEncode: '输入要编码的文本…',
      phDecode: '粘贴要解码的 base64…',
      invalid: '无效的 base64 输入。',
    },
    'json-prettify': {
      input: '你的 JSON',
      placeholder: '在此粘贴 JSON…',
      indent: '缩进',
      minify: '压缩',
      output: '输出',
      empty: '输入为空。',
    },
    'date-time-converter': {
      input: '日期 / 时间',
      placeholder: '如 2025-01-15T13:45:30Z',
      formats: '格式',
      unixSeconds: 'Unix（秒）',
      unixMs: 'Unix（毫秒）',
      iso: 'ISO 8601',
      rfc: 'RFC 1123',
      local: '本地',
      dateOnly: '仅日期',
      timeOnly: '仅时间',
      relative: '相对时间',
      invalid: '无效的日期。',
    },
    'jwt-parser': {
      input: 'JWT 令牌',
      placeholder: '在此粘贴你的 JWT…',
      header: '头部',
      payload: '负载',
      signature: '签名',
      invalid: '无效的 JWT。',
    },
    'http-status-codes': {
      search: '按状态码或名称筛选…',
      code: '状态码',
      name: '名称',
      desc: '说明',
    },
    'json-diff': {
      leftLabel: '左侧 JSON',
      rightLabel: '右侧 JSON',
      placeholder: '粘贴 JSON…',
      identical: '两份文档完全一致。',
    },
    'qrcode-generator': {
      value: '内容',
      placeholder: '要编码的文本或 URL…',
      size: '尺寸',
      level: '纠错等级',
      foreground: '前景色',
      background: '背景色',
      download: '下载 PNG',
      invalid: '输入为空。',
    },
    'regex-tester': {
      pattern: '正则表达式',
      flags: '标志',
      textLabel: '测试文本',
      textPlaceholder: '要匹配的文本…',
      matches: '{n} 处匹配',
      noMatch: '无匹配。',
      invalidRegex: '无效的正则表达式。',
    },
    'crontab-generator': {
      input: 'Cron 表达式',
      placeholder: '如 */5 * * * *',
      human: '可读描述',
      examples: '示例',
      invalid: '无效的 cron 表达式。',
    },
    'chmod-calculator': {
      owner: '所有者',
      group: '用户组',
      others: '其他',
      read: '读',
      write: '写',
      execute: '执行',
      octal: '八进制',
      symbolic: '符号',
      command: 'Shell 命令',
    },
    'ipv4-subnet-calculator': {
      input: 'CIDR',
      placeholder: '如 192.168.1.0/24',
      network: '网络地址',
      broadcast: '广播地址',
      mask: '子网掩码',
      wildcard: '通配掩码',
      firstHost: '首个主机',
      lastHost: '末个主机',
      totalHosts: '可用主机数',
      cidrNotation: 'CIDR 表示',
      ipClass: 'IP 类别',
      invalid: '无效的 IPv4 CIDR。',
    },
    'math-evaluator': {
      input: '表达式',
      placeholder: '如 2 + 3 * (4 - 1)',
      result: '结果',
      invalid: '无效的表达式。',
    },
    'temperature-converter': {
      input: '温度',
      celsius: '摄氏度（°C）',
      fahrenheit: '华氏度（°F）',
      kelvin: '开尔文（K）',
      invalid: '请输入有效数字。',
    },
    'emoji-picker': {
      search: '按名称搜索 emoji…',
      clickHint: '点击 emoji 查看详情。',
      noMatch: '无匹配。',
      decimal: '十进制',
      copyEmoji: '复制 emoji',
      copyCode: '复制码位',
    },
    'iban-validator-and-parser': {
      input: 'IBAN',
      placeholder: '如 GB82 WEST 1234 5698 7654 32',
      valid: 'IBAN 有效',
      invalid: 'IBAN 无效',
      country: '国家',
      bban: 'BBAN',
      checksum: '校验位',
      formatted: '格式化',
    },
  },
}
