/* =========================================================================
   Crypto tools
   ========================================================================= */
import { icons } from "../icons.js";
import { registerTool } from "../views/tool.js";
import { escapeHtml, makeCopyButton, copyText, flashCopy, debounce } from "../utils.js";

const { subtle, getRandomValues } = crypto;

/* ============== Hash text ============== */
registerTool("hash-text", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div>
          <label class="field-label">Text to hash</label>
          <textarea class="textarea" id="ht-input" placeholder="Type or paste text…">hello world</textarea>
        </div>
        <div class="row">
          <label class="field-label" style="margin:0;">Algorithm</label>
          <select class="select" id="ht-algo" style="max-width:200px;">
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256" selected>SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
            <option value="SHA-3">SHA-3 (256)</option>
          </select>
          <label class="row" style="gap:6px;font-size:var(--fs-sm);color:var(--muted);margin-left:auto;">
            <input type="checkbox" id="ht-uc" checked> Uppercase
          </label>
        </div>
        <div>
          <div class="row" style="justify-content:space-between;margin-bottom:var(--sp-2);">
            <label class="field-label" style="margin:0;">Digest (hex)</label>
            <div id="ht-copy"></div>
          </div>
          <div class="output-box" id="ht-out">—</div>
        </div>
      </div>`;

    const input = el.querySelector("#ht-input");
    const algo = el.querySelector("#ht-algo");
    const uc = el.querySelector("#ht-uc");
    const out = el.querySelector("#ht-out");
    const copySlot = el.querySelector("#ht-copy");
    let current = "";

    async function run() {
      const data = new TextEncoder().encode(input.value);
      let hex;
      if (algo.value === "SHA-3") {
        // No native SHA-3 — use js-sha3 (exposes window.sha3_256, etc.)
        if (typeof window.sha3_256 !== "function") {
          out.innerHTML = `<span style="color:var(--rose)">SHA-3 library not loaded.</span>`;
          return;
        }
        hex = window.sha3_256(data);
      } else {
        const buf = await subtle.digest(algo.value, data);
        hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
      }
      current = uc.checked ? hex.toUpperCase() : hex;
      out.textContent = current;
    }
    const dr = debounce(run, 80);
    input.addEventListener("input", dr);
    algo.addEventListener("change", run);
    uc.addEventListener("change", run);
    const cp = makeCopyButton(() => current);
    copySlot.appendChild(cp);
    run();
  }
});

/* ============== UUID generator ============== */
registerTool("uuid-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <button class="btn btn-primary" id="uu-gen">${icons.refresh} Generate</button>
          <button class="btn" id="uu-gen5">Generate 5</button>
          <label class="row" style="gap:6px;font-size:var(--fs-sm);color:var(--muted);">
            Uppercase <input type="checkbox" id="uu-uc">
          </label>
          <label class="row" style="gap:6px;font-size:var(--fs-sm);color:var(--muted);">
            Hyphens <input type="checkbox" id="uu-hy" checked>
          </label>
          <span style="margin-left:auto;font-family:var(--font-mono);font-size:11px;color:var(--muted-2);">v4 · RFC 4122</span>
        </div>
        <div class="output-box scroll" id="uu-out" style="min-height:120px;"></div>
      </div>`;

    const out = el.querySelector("#uu-out");
    const fmt = u => {
      let s = u;
      if (!el.querySelector("#uu-hy").checked) s = s.replace(/-/g, "");
      if (el.querySelector("#uu-uc").checked) s = s.toUpperCase();
      return s;
    };
    const v4 = () => crypto.randomUUID();
    const render = (n) => {
      const items = Array.from({ length: n }, () => fmt(v4()));
      out.innerHTML = "";
      items.forEach(item => {
        const row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--border-soft);";
        const span = document.createElement("span");
        span.style.cssText = "flex:1;word-break:break-all;";
        span.textContent = item;
        const btn = makeCopyButton(() => item);
        btn.className = "copy-btn";
        row.append(span, btn);
        out.append(row);
      });
    };
    el.querySelector("#uu-gen").addEventListener("click", () => render(1));
    el.querySelector("#uu-gen5").addEventListener("click", () => render(5));
    el.querySelector("#uu-uc").addEventListener("change", () => render(out.querySelectorAll("div").length || 1));
    el.querySelector("#uu-hy").addEventListener("change", () => render(out.querySelectorAll("div").length || 1));
    render(5);
  }
});

/* ============== ULID generator ============== */
registerTool("ulid-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <button class="btn btn-primary" id="ul-gen">${icons.refresh} Generate</button>
          <button class="btn" id="ul-gen10">Generate 10</button>
        </div>
        <div class="output-box scroll" id="ul-out" style="min-height:200px;"></div>
      </div>`;

    const ENCODE = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
    const out = el.querySelector("#ul-out");
    function ulid() {
      const time = Date.now();
      let ts = "";
      let t = time;
      for (let i = 0; i < 10; i++) { ts = ENCODE[t & 0x1f] + ts; t = Math.floor(t / 32); }
      let rand = "";
      const bytes = getRandomValues(new Uint8Array(16));
      for (let i = 0; i < 26; i++) {
        // Crockford base32 from 16 random bytes
        let v;
        if (i < 4) v = (bytes[Math.floor(i * 5 / 8)] >> (3 - i)) & 0x1f;
        // Simpler: build from random base32 chunks
        v = bytes[i % 16] & 0x1f;
        rand += ENCODE[v];
      }
      return ts + rand;
    }
    function render(n) {
      out.innerHTML = "";
      for (let i = 0; i < n; i++) {
        const id = ulid();
        const row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--border-soft);";
        const span = document.createElement("span");
        span.style.cssText = "flex:1;word-break:break-all;color:var(--accent-text);";
        span.textContent = id;
        row.append(span, makeCopyButton(() => id));
        out.append(row);
      }
    }
    el.querySelector("#ul-gen").addEventListener("click", () => render(1));
    el.querySelector("#ul-gen10").addEventListener("click", () => render(10));
    render(10);
  }
});

/* ============== Token generator ============== */
registerTool("token-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div>
          <label class="field-label">Length: <span id="tk-len-v" style="color:var(--accent-text);font-family:var(--font-mono);">32</span></label>
          <input type="range" id="tk-len" min="4" max="128" value="32" style="width:100%;">
        </div>
        <div class="grid-2">
          <label class="row" style="gap:8px;padding:var(--sp-3);background:var(--surface-2);border-radius:var(--r-md);cursor:pointer;">
            <input type="checkbox" id="tk-upper" checked> <strong>Uppercase</strong> <span class="muted-line" style="margin-left:auto;font-family:var(--font-mono);">ABC…</span>
          </label>
          <label class="row" style="gap:8px;padding:var(--sp-3);background:var(--surface-2);border-radius:var(--r-md);cursor:pointer;">
            <input type="checkbox" id="tk-lower" checked> <strong>Lowercase</strong> <span class="muted-line" style="margin-left:auto;font-family:var(--font-mono);">abc…</span>
          </label>
          <label class="row" style="gap:8px;padding:var(--sp-3);background:var(--surface-2);border-radius:var(--r-md);cursor:pointer;">
            <input type="checkbox" id="tk-num" checked> <strong>Numbers</strong> <span class="muted-line" style="margin-left:auto;font-family:var(--font-mono);">123…</span>
          </label>
          <label class="row" style="gap:8px;padding:var(--sp-3);background:var(--surface-2);border-radius:var(--r-md);cursor:pointer;">
            <input type="checkbox" id="tk-sym"> <strong>Symbols</strong> <span class="muted-line" style="margin-left:auto;font-family:var(--font-mono);">!-;…</span>
          </label>
        </div>
        <div class="row">
          <button class="btn btn-primary" id="tk-gen">${icons.refresh} Generate</button>
          <span class="tag" id="tk-entropy"></span>
        </div>
        <div>
          <div class="row" style="justify-content:space-between;margin-bottom:var(--sp-2);">
            <label class="field-label" style="margin:0;">Your token</label>
            <div id="tk-copy"></div>
          </div>
          <div class="output-box" id="tk-out" style="font-size:var(--fs-md);"></div>
        </div>
      </div>`;

    const len = el.querySelector("#tk-len");
    const lenV = el.querySelector("#tk-len-v");
    const out = el.querySelector("#tk-out");
    const ent = el.querySelector("#tk-entropy");
    let current = "";
    function alphabet() {
      let a = "";
      if (el.querySelector("#tk-upper").checked) a += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (el.querySelector("#tk-lower").checked) a += "abcdefghijklmnopqrstuvwxyz";
      if (el.querySelector("#tk-num").checked) a += "0123456789";
      if (el.querySelector("#tk-sym").checked) a += "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
      return a;
    }
    function run() {
      const a = alphabet();
      if (!a) { out.textContent = "Select at least one character set."; ent.textContent = ""; return; }
      const n = +len.value;
      const arr = new Uint32Array(n);
      getRandomValues(arr);
      let s = "";
      for (let i = 0; i < n; i++) s += a[arr[i] % a.length];
      current = s;
      out.textContent = s;
      const bits = Math.floor(n * Math.log2(a.length));
      ent.textContent = `${bits} bits of entropy`;
    }
    len.addEventListener("input", () => { lenV.textContent = len.value; run(); });
    ["#tk-upper", "#tk-lower", "#tk-num", "#tk-sym"].forEach(s => el.querySelector(s).addEventListener("change", run));
    el.querySelector("#tk-gen").addEventListener("click", run);
    el.querySelector("#tk-copy").append(makeCopyButton(() => current));
    run();
  }
});

/* ============== HMAC generator ============== */
registerTool("hmac-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2 uneven">
        <div class="stack">
          <div>
            <label class="field-label">Secret key</label>
            <input class="input" id="hm-key" type="text" value="my-secret" placeholder="Secret">
          </div>
          <div>
            <label class="field-label">Message</label>
            <textarea class="textarea" id="hm-msg">hello world</textarea>
          </div>
        </div>
        <div class="stack">
          <div>
            <label class="field-label">Algorithm</label>
            <select class="select" id="hm-algo">
              <option value="SHA-1">SHA-1</option>
              <option value="SHA-256" selected>SHA-256</option>
              <option value="SHA-384">SHA-384</option>
              <option value="SHA-512">SHA-512</option>
            </select>
          </div>
          <div>
            <label class="field-label">Output (hex)</label>
            <div class="output-box" id="hm-out" style="word-break:break-all;">—</div>
          </div>
          <div id="hm-copy"></div>
        </div>
      </div>`;

    const key = el.querySelector("#hm-key");
    const msg = el.querySelector("#hm-msg");
    const algo = el.querySelector("#hm-algo");
    const out = el.querySelector("#hm-out");
    let current = "";
    async function run() {
      try {
        const k = await subtle.importKey("raw", new TextEncoder().encode(key.value), { name: "HMAC", hash: algo.value }, false, ["sign"]);
        const sig = await subtle.sign("HMAC", k, new TextEncoder().encode(msg.value));
        current = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
        out.textContent = current;
      } catch (e) { out.textContent = "Error: " + e.message; }
    }
    [key, msg, algo].forEach(e => e.addEventListener("input", debounce(run, 80)));
    el.querySelector("#hm-copy").append(makeCopyButton(() => current));
    run();
  }
});

/* ============== Bcrypt ============== */
registerTool("bcrypt", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2">
        <div class="stack">
          <h3 style="font-size:var(--fs-md);color:var(--text-strong);">Hash</h3>
          <div>
            <label class="field-label">Text to hash</label>
            <input class="input" id="bc-in" type="text" value="password" placeholder="Password">
          </div>
          <div>
            <label class="field-label">Rounds (cost): <span id="bc-rounds-v" style="color:var(--accent-text);font-family:var(--font-mono);">10</span></label>
            <input type="range" id="bc-rounds" min="4" max="14" value="10" style="width:100%;">
          </div>
          <button class="btn btn-primary" id="bc-gen">${icons.refresh} Hash</button>
          <div class="output-box scroll" id="bc-out" style="min-height:60px;">—</div>
          <div id="bc-copy"></div>
        </div>
        <div class="stack">
          <h3 style="font-size:var(--fs-md);color:var(--text-strong);">Compare / verify</h3>
          <div>
            <label class="field-label">Plain text</label>
            <input class="input" id="bc-cmp" type="text" value="password">
          </div>
          <div>
            <label class="field-label">Hash</label>
            <input class="input" id="bc-hash" type="text" style="font-family:var(--font-mono);font-size:var(--fs-xs);" placeholder="$2a$10$...">
          </div>
          <button class="btn" id="bc-verify">Verify</button>
          <div class="output-box" id="bc-res">—</div>
        </div>
      </div>
      <p class="muted-line" style="margin-top:var(--sp-4);">Loaded via <code>bcryptjs</code>.</p>`;

    const bcrypt = window.bcrypt || (window.dcodeIO && window.dcodeIO.bcrypt);
    if (!bcrypt) {
      el.innerHTML = `<div class="notice">${icons.alert}<div>Loading bcrypt library… if this persists, check your connection.</div></div>`;
      return;
    }
    const rounds = el.querySelector("#bc-rounds");
    el.querySelector("#bc-rounds-v").textContent = rounds.value;
    rounds.addEventListener("input", () => el.querySelector("#bc-rounds-v").textContent = rounds.value);

    const out = el.querySelector("#bc-out");
    let current = "";
    el.querySelector("#bc-gen").addEventListener("click", () => {
      const salt = bcrypt.genSaltSync(+rounds.value);
      current = bcrypt.hashSync(el.querySelector("#bc-in").value, salt);
      out.textContent = current;
    });
    el.querySelector("#bc-copy").append(makeCopyButton(() => current));
    el.querySelector("#bc-verify").addEventListener("click", () => {
      const res = el.querySelector("#bc-res");
      try {
        const ok = bcrypt.compareSync(el.querySelector("#bc-cmp").value, el.querySelector("#bc-hash").value);
        res.innerHTML = ok
          ? `<span class="tag tag-add">${icons.check} Match</span>`
          : `<span class="tag tag-del">${icons.x} No match</span>`;
      } catch (e) { res.innerHTML = `<span class="tag tag-del">Invalid hash</span>`; }
    });
  }
});

/* ============== RSA key pair generator ============== */
registerTool("rsa-key-pair-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <label class="field-label" style="margin:0;">Key size</label>
          <select class="select" id="rsa-bits" style="max-width:140px;">
            <option value="2048">2048</option>
            <option value="4096" selected>4096</option>
          </select>
          <button class="btn btn-primary" id="rsa-gen">${icons.refresh} Generate key pair</button>
          <span class="muted-line" id="rsa-status" style="margin-left:auto;font-size:var(--fs-xs);"></span>
        </div>
        <div class="grid-2">
          <div class="stack">
            <label class="field-label">Public key (SPKI / PEM)</label>
            <div class="output-box scroll" id="rsa-pub" style="min-height:200px;">—</div>
            <div id="rsa-pub-cp"></div>
          </div>
          <div class="stack">
            <label class="field-label">Private key (PKCS8 / PEM)</label>
            <div class="output-box scroll" id="rsa-priv" style="min-height:200px;">—</div>
            <div id="rsa-priv-cp"></div>
          </div>
        </div>
      </div>`;

    const status = el.querySelector("#rsa-status");
    let pub = "", priv = "";
    async function pem(key, ops) {
      const exp = ops === "private" ? await subtle.exportKey("pkcs8", key) : await subtle.exportKey("spki", key);
      const b64 = btoa(String.fromCharCode(...new Uint8Array(exp)));
      const wrapped = b64.match(/.{1,64}/g).join("\n");
      return `-----BEGIN ${ops === "private" ? "PRIVATE" : "PUBLIC"} KEY-----\n${wrapped}\n-----END ${ops === "private" ? "PRIVATE" : "PUBLIC"} KEY-----`;
    }
    async function run() {
      status.textContent = "Generating…";
      try {
        const kp = await subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: +el.querySelector("#rsa-bits").value, publicExponent: new Uint8Array([1,0,1]), hash: "SHA-256" }, true, ["sign","verify"]);
        pub = await pem(kp.publicKey, "public");
        priv = await pem(kp.privateKey, "private");
        el.querySelector("#rsa-pub").textContent = pub;
        el.querySelector("#rsa-priv").textContent = priv;
        status.textContent = "Done";
      } catch (e) { status.textContent = "Error: " + e.message; }
    }
    el.querySelector("#rsa-gen").addEventListener("click", run);
    el.querySelector("#rsa-pub-cp").append(makeCopyButton(() => pub, "Copy public"));
    el.querySelector("#rsa-priv-cp").append(makeCopyButton(() => priv, "Copy private"));
  }
});

/* ============== Password strength analyser ============== */
registerTool("password-strength-analyser", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">Password</label>
        <div class="row">
          <input class="input" id="pw-in" type="text" value="Tr0ub4dor&3" placeholder="Type a password" autocomplete="off">
          <button class="icon-btn" id="pw-eye" title="Toggle visibility">${icons.eyeOff}</button>
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
            <span class="field-label" style="margin:0;">Strength</span>
            <span id="pw-label" style="font-family:var(--font-mono);font-size:var(--fs-xs);"></span>
          </div>
          <div style="height:8px;background:var(--surface-2);border-radius:var(--r-pill);overflow:hidden;">
            <div id="pw-bar" style="height:100%;width:0;background:var(--rose);transition:width 240ms var(--ease),background 240ms var(--ease);"></div>
          </div>
        </div>
        <dl class="kv" id="pw-stats"></dl>
      </div>`;

    const inp = el.querySelector("#pw-in");
    const eye = el.querySelector("#pw-eye");
    eye.addEventListener("click", () => {
      inp.type = inp.type === "password" ? "text" : "password";
      eye.innerHTML = inp.type === "password" ? icons.eyeOff : icons.search;
    });
    function entropy(pw) {
      if (!pw) return 0;
      let pool = 0;
      if (/[a-z]/.test(pw)) pool += 26;
      if (/[A-Z]/.test(pw)) pool += 26;
      if (/[0-9]/.test(pw)) pool += 10;
      if (/[^a-zA-Z0-9]/.test(pw)) pool += 33;
      return Math.floor(pw.length * Math.log2(pool || 1));
    }
    function run() {
      const pw = inp.value;
      const e = entropy(pw);
      const bar = el.querySelector("#pw-bar");
      const label = el.querySelector("#pw-label");
      const stats = el.querySelector("#pw-stats");
      const log10 = e * Math.log10(2);
      const seconds = Math.pow(10, log10) / 1e10; // assume 10 billion guesses/sec
      let human;
      if (seconds < 1) human = "instant";
      else if (seconds < 60) human = `${seconds.toFixed(0)} seconds`;
      else if (seconds < 3600) human = `${(seconds/60).toFixed(0)} minutes`;
      else if (seconds < 86400) human = `${(seconds/3600).toFixed(0)} hours`;
      else if (seconds < 31536000) human = `${(seconds/86400).toFixed(0)} days`;
      else if (seconds < 31536000 * 1000) human = `${(seconds/31536000).toFixed(0)} years`;
      else if (seconds < 31536000 * 1e9) human = `${(seconds/31536000/1000).toFixed(0)} thousand years`;
      else human = "millennia+";
      const pct = Math.min(100, e / 1.4);
      let color = "var(--rose)", text = "Very weak";
      if (e >= 100) { color = "var(--lime)"; text = "Excellent"; }
      else if (e >= 80) { color = "var(--lime)"; text = "Strong"; }
      else if (e >= 60) { color = "var(--amber)"; text = "Fair"; }
      else if (e >= 36) { color = "var(--amber)"; text = "Weak"; }
      bar.style.width = pct + "%";
      bar.style.background = color;
      label.textContent = text;
      label.style.color = color;
      stats.innerHTML = `
        <dt>Length</dt><dd>${pw.length}</dd>
        <dt>Entropy</dt><dd>~${e} bits</dd>
        <dt>Character pool</dt><dd>${(/[a-z]/.test(pw)?26:0)+(/[A-Z]/.test(pw)?26:0)+(/[0-9]/.test(pw)?10:0)+(/[^a-zA-Z0-9]/.test(pw)?33:0)}</dd>
        <dt>Est. crack time</dt><dd>${human}</dd>
        <dt>Has lower</dt><dd>${/[a-z]/.test(pw)?"yes":"no"}</dd>
        <dt>Has upper</dt><dd>${/[A-Z]/.test(pw)?"yes":"no"}</dd>
        <dt>Has digit</dt><dd>${/[0-9]/.test(pw)?"yes":"no"}</dd>
        <dt>Has symbol</dt><dd>${/[^a-zA-Z0-9]/.test(pw)?"yes":"no"}</dd>
      `;
    }
    inp.addEventListener("input", debounce(run, 60));
    run();
  }
});

/* ============== BIP39 generator ============== */
registerTool("bip39-generator", {
  async mount(el) {
    el.innerHTML = `<div class="notice">${icons.alert}<div>Loading BIP39 wordlist…</div></div>`;
    try {
      const res = await fetch("https://cdn.jsdelivr.net/npm/bip39@3.1.0/src/wordlists/english.json");
      const wordlist = await res.json();
      el.innerHTML = `
        <div class="stack">
          <div class="row">
            <label class="field-label" style="margin:0;">Entropy</label>
            <select class="select" id="b39-ent" style="max-width:160px;">
              <option value="128">128 bits (12 words)</option>
              <option value="160">160 bits (15 words)</option>
              <option value="192">192 bits (18 words)</option>
              <option value="224">224 bits (21 words)</option>
              <option value="256" selected>256 bits (24 words)</option>
            </select>
            <button class="btn btn-primary" id="b39-gen">${icons.refresh} Generate</button>
            <div style="margin-left:auto;" id="b39-copy"></div>
          </div>
          <div class="output-box" id="b39-out" style="font-size:var(--fs-md);line-height:1.8;">—</div>
          <p class="muted-line">Words are picked uniformly from the official BIP39 English wordlist (2048 words). For non-critical use only.</p>
        </div>`;
      let current = "";
      function gen() {
        const bytes = +el.querySelector("#b39-ent").value / 8;
        const rnd = getRandomValues(new Uint8Array(bytes));
        // checksum: first ENT/32 bits of SHA-256
        const hash = Array.from(getRandomValues); // not used; we'll use sync via subtle later
        // We need SHA-256 of entropy. subtle.digest is async — but to keep it simple use a sync approach:
        // Use a tiny inline sha256
        return sha256Hex(rnd).then(h => {
          const entBits = bytes * 8;
          const csBits = entBits / 32;
          const bits = bytesToBits(rnd) + hexToBits(h).slice(0, csBits);
          const words = [];
          for (let i = 0; i < bits.length; i += 11) {
            const idx = parseInt(bits.slice(i, i + 11), 2);
            words.push(wordlist[idx]);
          }
          current = words.join(" ");
          el.querySelector("#b39-out").textContent = current;
        });
      }
      el.querySelector("#b39-gen").addEventListener("click", gen);
      el.querySelector("#b39-copy").append(makeCopyButton(() => current));
      await gen();
    } catch (e) {
      el.innerHTML = `<div class="notice">${icons.alert}<div>Could not load BIP39 wordlist: ${e.message}</div></div>`;
    }
  }
});

// helpers for BIP39
async function sha256Hex(bytes) {
  const buf = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function bytesToBits(bytes) {
  return Array.from(bytes).map(b => b.toString(2).padStart(8, "0")).join("");
}
function hexToBits(hex) {
  let bits = "";
  for (let i = 0; i < hex.length; i++) bits += parseInt(hex[i], 16).toString(2).padStart(4, "0");
  return bits;
}

/* ============== Encrypt / decrypt (AES-GCM) ============== */
registerTool("encryption", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row" style="justify-content:space-between;">
          <h3 style="font-size:var(--fs-md);color:var(--text-strong);">AES-GCM (256)</h3>
          <div class="row">
            <button class="btn btn-sm btn-ghost" id="en-mode-enc" data-active="true">Encrypt</button>
            <button class="btn btn-sm btn-ghost" id="en-mode-dec">Decrypt</button>
          </div>
        </div>
        <div>
          <label class="field-label">Passphrase</label>
          <input class="input" id="en-pass" type="text" value="" placeholder="A strong passphrase">
        </div>
        <div>
          <label class="field-label" id="en-in-label">Plaintext</label>
          <textarea class="textarea" id="en-in" placeholder="Text to encrypt…">Hello, secret world.</textarea>
        </div>
        <button class="btn btn-primary" id="en-go">${icons.lock} Encrypt</button>
        <div>
          <div class="row" style="justify-content:space-between;margin-bottom:var(--sp-2);">
            <label class="field-label" style="margin:0;" id="en-out-label">Ciphertext (base64)</label>
            <div id="en-copy"></div>
          </div>
          <div class="output-box scroll" id="en-out">—</div>
        </div>
      </div>`;

    let mode = "enc";
    const inLab = el.querySelector("#en-in-label");
    const outLab = el.querySelector("#en-out-label");
    const goBtn = el.querySelector("#en-go");
    const encBtn = el.querySelector("#en-mode-enc");
    const decBtn = el.querySelector("#en-mode-dec");
    function setMode(m) {
      mode = m;
      encBtn.classList.toggle("btn-primary", m === "enc");
      encBtn.classList.toggle("btn-ghost", m !== "enc");
      decBtn.classList.toggle("btn-primary", m === "dec");
      decBtn.classList.toggle("btn-ghost", m !== "dec");
      inLab.textContent = m === "enc" ? "Plaintext" : "Ciphertext (base64)";
      outLab.textContent = m === "enc" ? "Ciphertext (base64)" : "Plaintext";
      goBtn.innerHTML = m === "enc" ? `${icons.lock} Encrypt` : `${icons.key} Decrypt`;
    }
    encBtn.addEventListener("click", () => setMode("enc"));
    decBtn.addEventListener("click", () => setMode("dec"));

    let current = "";
    async function derive(pass, salt) {
      return subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
        await subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]),
        { name: "AES-GCM", length: 256 }, false, ["encrypt","decrypt"]);
    }
    async function run() {
      const out = el.querySelector("#en-out");
      const pass = el.querySelector("#en-pass").value;
      const input = el.querySelector("#en-in").value;
      if (!pass) { out.textContent = "Enter a passphrase."; return; }
      try {
        if (mode === "enc") {
          const salt = getRandomValues(new Uint8Array(16));
          const iv = getRandomValues(new Uint8Array(12));
          const key = await derive(pass, salt);
          const data = new TextEncoder().encode(input);
          const ct = await subtle.encrypt({ name: "AES-GCM", iv }, key, data);
          // pack salt(16) + iv(12) + ct
          const packed = new Uint8Array(salt.length + iv.length + ct.byteLength);
          packed.set(salt, 0); packed.set(iv, 16); packed.set(new Uint8Array(ct), 28);
          current = btoa(String.fromCharCode(...packed));
          out.textContent = current;
        } else {
          const packed = Uint8Array.from(atob(input), c => c.charCodeAt(0));
          const salt = packed.slice(0, 16);
          const iv = packed.slice(16, 28);
          const ct = packed.slice(28);
          const key = await derive(pass, salt);
          const pt = await subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
          current = new TextDecoder().decode(pt);
          out.textContent = current;
        }
      } catch (e) { out.innerHTML = `<span style="color:var(--rose)">Error: ${e.message}</span>`; }
    }
    goBtn.addEventListener("click", run);
    el.querySelector("#en-copy").append(makeCopyButton(() => current));
  }
});
