/* =========================================================================
   Web tools
   ========================================================================= */
import { icons } from "../icons.js";
import { registerTool } from "../views/tool.js";
import { escapeHtml, makeCopyButton, debounce } from "../utils.js";

/* ============== URL encoder/decoder ============== */
registerTool("url-encoder", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2">
        <div class="stack">
          <label class="field-label">Plain text</label>
          <textarea class="textarea" id="ue-plain">hello world & friends=?</textarea>
        </div>
        <div class="stack">
          <label class="field-label">URL-encoded</label>
          <textarea class="textarea" id="ue-enc"></textarea>
        </div>
      </div>
      <div class="row" style="margin-top:var(--sp-4);">
        <label class="row" style="gap:6px;font-size:var(--fs-sm);color:var(--muted);">
          <input type="radio" name="ue-mode" value="component" checked> encodeURIComponent
        </label>
        <label class="row" style="gap:6px;font-size:var(--fs-sm);color:var(--muted);">
          <input type="radio" name="ue-mode" value="uri"> encodeURI
        </label>
      </div>`;
    const plain = el.querySelector("#ue-plain");
    const enc = el.querySelector("#ue-enc");
    const getMode = () => el.querySelector('input[name="ue-mode"]:checked').value;
    function toEnc() {
      try { enc.value = getMode() === "uri" ? encodeURIComponent(plain.value) : encodeURIComponent(plain.value); } catch {}
    }
    function toPlain() {
      try { plain.value = decodeURIComponent(enc.value); } catch {}
    }
    plain.addEventListener("input", toEnc);
    enc.addEventListener("input", toPlain);
    el.querySelectorAll('input[name="ue-mode"]').forEach(r => r.addEventListener("change", toEnc));
    toEnc();
  }
});

/* ============== URL parser ============== */
registerTool("url-parser", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">URL</label>
        <input class="input" id="up-in" value="https://user:pass@example.com:8080/path/to/page?name=Alice&age=30#section" style="font-family:var(--font-mono);font-size:var(--fs-sm);">
        <dl class="kv" id="up-out"></dl>
        <div id="up-params"></div>
      </div>`;
    const inp = el.querySelector("#up-in");
    function run() {
      try {
        const u = new URL(inp.value);
        const fields = [
          ["Protocol", u.protocol],
          ["Username", u.username],
          ["Password", u.password],
          ["Host", u.host],
          ["Hostname", u.hostname],
          ["Port", u.port],
          ["Path", u.pathname],
          ["Query", u.search],
          ["Hash", u.hash],
          ["Origin", u.origin],
        ];
        el.querySelector("#up-out").innerHTML = fields.map(([k,v]) => `<dt>${k}</dt><dd>${v || "—"}</dd>`).join("");
        const params = [...u.searchParams.entries()];
        el.querySelector("#up-params").innerHTML = params.length
          ? `<label class="field-label" style="margin-top:var(--sp-3);">Query params</label>
             <div class="grid-2">${params.map(([k,v]) => `<div class="output-box" style="padding:8px 12px;"><strong style="color:var(--accent-text);">${escapeHtml(k)}</strong><br>${escapeHtml(v)}</div>`).join("")}</div>`
          : "";
      } catch {
        el.querySelector("#up-out").innerHTML = `<dt>Error</dt><dd style="color:var(--rose);">Invalid URL</dd>`;
        el.querySelector("#up-params").innerHTML = "";
      }
    }
    inp.addEventListener("input", debounce(run, 100));
    run();
  }
});

/* ============== HTML entities ============== */
registerTool("html-entities", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2">
        <div class="stack">
          <label class="field-label">Raw HTML</label>
          <textarea class="textarea" id="he-raw"><a href="/">Tom & Jerry</a></textarea>
        </div>
        <div class="stack">
          <label class="field-label">Escaped</label>
          <textarea class="textarea" id="he-esc"></textarea>
        </div>
      </div>`;
    const raw = el.querySelector("#he-raw");
    const esc = el.querySelector("#he-esc");
    function enc() {
      esc.value = raw.value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
    }
    function dec() {
      const ta = document.createElement("textarea"); ta.innerHTML = esc.value; raw.value = ta.value;
    }
    raw.addEventListener("input", enc);
    esc.addEventListener("input", dec);
    enc();
  }
});

/* ============== JWT parser ============== */
registerTool("jwt-parser", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">JWT</label>
        <textarea class="textarea" id="jwt-in" style="min-height:90px;font-size:var(--fs-xs);">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaWNlIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c</textarea>
        <div class="grid-2" id="jwt-out"></div>
      </div>`;
    const inp = el.querySelector("#jwt-in");
    function b64urlDecode(s) {
      s = s.replace(/-/g,"+").replace(/_/g,"/");
      while (s.length % 4) s += "=";
      return decodeURIComponent(atob(s).split("").map(c => "%"+("00"+c.charCodeAt(0).toString(16)).slice(-2)).join(""));
    }
    function prettyJson(str) {
      try { return JSON.stringify(JSON.parse(str), null, 2); } catch { return str; }
    }
    function run() {
      const parts = inp.value.trim().split(".");
      const out = el.querySelector("#jwt-out");
      if (parts.length !== 3) {
        out.innerHTML = `<div class="output-box" style="grid-column:1/-1;color:var(--rose);">A JWT must have 3 parts separated by dots.</div>`;
        return;
      }
      const [header, payload, sig] = parts;
      out.innerHTML = `
        <div class="stack">
          <label class="field-label">Header</label>
          <pre class="output-box scroll">${escapeHtml(prettyJson(b64urlDecode(header)))}</pre>
        </div>
        <div class="stack">
          <label class="field-label">Payload</label>
          <pre class="output-box scroll">${escapeHtml(prettyJson(b64urlDecode(payload)))}</pre>
        </div>
        <div class="stack" style="grid-column:1/-1;">
          <label class="field-label">Signature (base64url)</label>
          <div class="output-box" style="word-break:break-all;">${escapeHtml(sig)}</div>
        </div>`;
      // claim timestamps
      try {
        const p = JSON.parse(b64urlDecode(payload));
        const claims = [];
        if (p.iat) claims.push(["Issued at", new Date(p.iat*1000).toISOString()]);
        if (p.exp) claims.push(["Expires", new Date(p.exp*1000).toISOString()]);
        if (p.nbf) claims.push(["Not before", new Date(p.nbf*1000).toISOString()]);
        if (claims.length) {
          out.innerHTML += `<dl class="kv" style="grid-column:1/-1;margin-top:var(--sp-3);">${claims.map(([k,v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("")}</dl>`;
        }
      } catch {}
    }
    inp.addEventListener("input", debounce(run, 100));
    run();
  }
});

/* ============== User-agent parser ============== */
registerTool("user-agent-parser", {
  mount(el) {
    const ua = navigator.userAgent;
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">User-agent</label>
        <input class="input" id="ua-in" value="${escapeHtml(ua)}" style="font-family:var(--font-mono);font-size:var(--fs-xs);">
        <dl class="kv" id="ua-out"></dl>
      </div>`;
    const inp = el.querySelector("#ua-in");
    function run() {
      const s = inp.value;
      const getBrowser = () => {
        if (/Edg\/(\d+)/.test(s)) return ["Edge", RegExp.$1];
        if (/OPR\/(\d+)/.test(s) || /Opera/.test(s)) return ["Opera", RegExp.$1];
        if (/Chrome\/(\d+)/.test(s)) return ["Chrome", RegExp.$1];
        if (/Firefox\/(\d+)/.test(s)) return ["Firefox", RegExp.$1];
        if (/Version\/(\d+).*Safari/.test(s)) return ["Safari", RegExp.$1];
        return ["Unknown", ""];
      };
      const getOS = () => {
        if (/Windows NT 10/.test(s)) return "Windows 10/11";
        if (/Windows/.test(s)) return "Windows";
        if (/Mac OS X ([\d_]+)/.test(s)) return "macOS " + RegExp.$1.replace(/_/g,".");
        if (/Android (\d+)/.test(s)) return "Android " + RegExp.$1;
        if (/iPhone OS (\d+)/.test(s)) return "iOS " + RegExp.$1;
        if (/Linux/.test(s)) return "Linux";
        return "Unknown";
      };
      const getEngine = () => {
        if (/Gecko\/|Firefox/.test(s)) return "Gecko";
        if (/AppleWebKit/.test(s) && /Chrome/.test(s)) return "Blink";
        if (/AppleWebKit/.test(s)) return "WebKit";
        return "Unknown";
      };
      const [bn, bv] = getBrowser();
      const device = /Mobi|Android|iPhone|iPad/.test(s) ? "Mobile" : "Desktop";
      el.querySelector("#ua-out").innerHTML = `
        <dt>Browser</dt><dd>${bn}${bv ? " "+bv : ""}</dd>
        <dt>Engine</dt><dd>${getEngine()}</dd>
        <dt>OS</dt><dd>${getOS()}</dd>
        <dt>Device</dt><dd>${device}</dd>
        <dt>Bot</dt><dd>${/bot|crawl|spider/i.test(s) ? "yes" : "no"}</dd>`;
    }
    inp.addEventListener("input", run);
    run();
  }
});

/* ============== HTTP status codes ============== */
registerTool("http-status-codes", {
  mount(el) {
    const codes = [
      [100,"Continue","Informational"],[101,"Switching Protocols","Informational"],[103,"Early Hints","Informational"],
      [200,"OK","Success"],[201,"Created","Success"],[202,"Accepted","Success"],[204,"No Content","Success"],[206,"Partial Content","Success"],
      [301,"Moved Permanently","Redirection"],[302,"Found","Redirection"],[304,"Not Modified","Redirection"],[307,"Temporary Redirect","Redirection"],[308,"Permanent Redirect","Redirection"],
      [400,"Bad Request","Client error"],[401,"Unauthorized","Client error"],[403,"Forbidden","Client error"],[404,"Not Found","Client error"],[405,"Method Not Allowed","Client error"],[408,"Request Timeout","Client error"],[409,"Conflict","Client error"],[410,"Gone","Client error"],[418,"I'm a teapot","Client error"],[422,"Unprocessable Entity","Client error"],[429,"Too Many Requests","Client error"],
      [500,"Internal Server Error","Server error"],[501,"Not Implemented","Server error"],[502,"Bad Gateway","Server error"],[503,"Service Unavailable","Server error"],[504,"Gateway Timeout","Server error"],[511,"Network Authentication Required","Server error"],
    ];
    const classColor = { Informational: "var(--sky)", Success: "var(--lime)", Redirection: "var(--amber)", "Client error": "var(--rose)", "Server error": "var(--violet)" };
    el.innerHTML = `
      <div class="stack">
        <input class="input" id="hs-search" placeholder="Filter by code or name…" style="max-width:340px;">
        <div id="hs-list" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:var(--sp-2);"></div>
      </div>`;
    const search = el.querySelector("#hs-search");
    const list = el.querySelector("#hs-list");
    function run() {
      const q = search.value.toLowerCase();
      list.innerHTML = codes
        .filter(([c,n,cl]) => !q || String(c).includes(q) || n.toLowerCase().includes(q) || cl.toLowerCase().includes(q))
        .map(([c,n,cl]) => `
          <div style="padding:10px 14px;background:var(--surface-2);border-radius:var(--r-md);border:1px solid var(--border-soft);">
            <div style="display:flex;align-items:center;gap:8px;">
              <span style="font-family:var(--font-mono);font-weight:700;font-size:var(--fs-md);color:${classColor[cl]};">${c}</span>
              <span style="font-size:var(--fs-xs);color:${classColor[cl]};font-weight:600;">${cl}</span>
            </div>
            <div style="font-size:var(--fs-sm);margin-top:2px;">${n}</div>
          </div>`).join("");
    }
    search.addEventListener("input", debounce(run, 80));
    run();
  }
});

/* ============== MIME types ============== */
registerTool("mime-types", {
  mount(el) {
    const map = {
      "text/html":["html","htm"],"text/css":["css"],"text/javascript":["js","mjs"],"application/json":["json"],"text/xml":["xml"],
      "text/plain":["txt"],"text/markdown":["md","markdown"],"application/zip":["zip"],"application/x-gzip":["gz","gzip"],
      "application/x-tar":["tar"],"application/x-7z-compressed":["7z"],"application/pdf":["pdf"],"image/jpeg":["jpg","jpeg"],
      "image/png":["png"],"image/gif":["gif"],"image/svg+xml":["svg"],"image/webp":["webp"],"image/x-icon":["ico"],
      "audio/mpeg":["mp3"],"audio/wav":["wav"],"video/mp4":["mp4"],"video/webm":["webm"],"application/octet-stream":["bin","exe"],
      "application/xml":["xml"],"text/csv":["csv"],"application/javascript":["js"],"font/woff":["woff"],"font/woff2":["woff2"],
      "application/wasm":["wasm"],"application/x-yaml":["yaml","yml"],"application/toml":["toml"],"text/x-shellscript":["sh"],
    };
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">MIME type or extension</label>
        <input class="input" id="mt-in" placeholder='image/png  or  .png' style="font-family:var(--font-mono);">
        <div id="mt-out"></div>
      </div>`;
    const inp = el.querySelector("#mt-in");
    function run() {
      const q = inp.value.trim().toLowerCase().replace(/^\./,"");
      const out = el.querySelector("#mt-out");
      if (!q) { out.innerHTML = `<p class="muted-line">Type a MIME type (e.g. <code>image/png</code>) or extension (e.g. <code>png</code>).</p>`; return; }
      const results = [];
      for (const [mime, exts] of Object.entries(map)) {
        if (mime.includes(q) || exts.some(e => e.includes(q))) results.push([mime, exts]);
      }
      out.innerHTML = results.length ? `<div class="grid-2">${results.map(([m,e]) => `
        <div class="output-box" style="padding:10px 14px;">
          <div style="color:var(--accent-text);font-weight:600;">${m}</div>
          <div style="margin-top:4px;">${e.map(x => `<span class="tag">.${x}</span>`).join(" ")}</div>
        </div>`).join("")}</div>` : `<p class="muted-line">No matches.</p>`;
    }
    inp.addEventListener("input", debounce(run, 80));
    run();
  }
});

/* ============== Keycode info ============== */
registerTool("keycode-info", {
  mount(el) {
    el.innerHTML = `
      <div class="stack" style="text-align:center;">
        <p class="muted-line">Press any key to inspect its event properties.</p>
        <div class="output-box" id="kc-key" style="font-size:48px;font-family:var(--font-display);font-weight:700;text-align:center;padding:var(--sp-8);">—</div>
        <dl class="kv" id="kc-info" style="text-align:left;"></dl>
      </div>`;
    const keyBox = el.querySelector("#kc-key");
    const info = el.querySelector("#kc-info");
    function handler(e) {
      if (!isMounted) return;
      e.preventDefault();
      keyBox.textContent = e.key === " " ? "Space" : e.key;
      info.innerHTML = `
        <dt>event.key</dt><dd>${e.key === " " ? "\" \"" : e.key}</dd>
        <dt>event.code</dt><dd>${e.code}</dd>
        <dt>keyCode (deprecated)</dt><dd>${e.keyCode}</dd>
        <dt>location</dt><dd>${["general","left","right","numpad"][e.location] || e.location}</dd>
        <dt>Modifiers</dt><dd>${["ctrl","shift","alt","meta"].filter(m => e[m+"Key"]).join("+") || "none"}</dd>
        <dt>repeat</dt><dd>${e.repeat}</dd>`;
    }
    let isMounted = true;
    window.addEventListener("keydown", handler, true);
    el._cleanup = () => { isMounted = false; window.removeEventListener("keydown", handler, true); };
  },
  unmount(el) { if (el._cleanup) el._cleanup(); }
});

/* ============== Device information ============== */
registerTool("device-information", {
  mount(el) {
    const s = screen;
    el.innerHTML = `
      <div class="stack">
        <dl class="kv">
          <dt>User agent</dt><dd>${escapeHtml(navigator.userAgent)}</dd>
          <dt>Platform</dt><dd>${navigator.platform || "—"}</dd>
          <dt>Language</dt><dd>${navigator.language}</dd>
          <dt>Languages</dt><dd>${navigator.languages.join(", ")}</dd>
          <dt>Screen size</dt><dd>${s.width} × ${s.height}</dd>
          <dt>Available size</dt><dd>${s.availWidth} × ${s.availHeight}</dd>
          <dt>Window size</dt><dd>${innerWidth} × ${innerHeight}</dd>
          <dt>Color depth</dt><dd>${s.colorDepth} bits</dd>
          <dt>Pixel ratio</dt><dd>${devicePixelRatio}</dd>
          <dt>Timezone</dt><dd>${Intl.DateTimeFormat().resolvedOptions().timeZone}</dd>
          <dt>Cookies</dt><dd>${navigator.cookieEnabled ? "enabled" : "disabled"}</dd>
          <dt>Online</dt><dd>${navigator.onLine ? "yes" : "no"}</dd>
          <dt>Cores (logical)</dt><dd>${navigator.hardwareConcurrency || "—"}</dd>
          <dt>Touch</dt><dd>${("ontouchstart" in window) ? "yes" : "no"}</dd>
          <dt>PDF viewer</dt><dd>${navigator.pdfViewerEnabled ? "yes" : "no"}</dd>
        </dl>
        <div class="row">
          <button class="btn btn-sm" id="di-copy">Copy all</button>
        </div>
      </div>`;
    el.querySelector("#di-copy").addEventListener("click", () => {
      const txt = [...el.querySelectorAll("dt,dd")].reduce((acc, e, i, a) => {
        if (i % 2 === 0) return acc + e.textContent + ": ";
        return acc + e.textContent + "\n";
      }, "");
      navigator.clipboard.writeText(txt);
    });
  }
});

/* ============== Basic auth generator ============== */
registerTool("basic-auth-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2">
        <div class="stack">
          <label class="field-label">Username</label>
          <input class="input" id="ba-user" value="admin">
          <label class="field-label">Password</label>
          <input class="input" id="ba-pass" value="s3cr3t" type="text">
        </div>
        <div class="stack">
          <label class="field-label">Authorization header</label>
          <div class="output-box" id="ba-out" style="word-break:break-all;">—</div>
          <div id="ba-copy"></div>
          <label class="field-label">Base64 (user:pass)</label>
          <div class="output-box" id="ba-b64">—</div>
        </div>
      </div>`;
    const user = el.querySelector("#ba-user");
    const pass = el.querySelector("#ba-pass");
    function run() {
      const raw = user.value + ":" + pass.value;
      const b64 = btoa(unescape(encodeURIComponent(raw)));
      el.querySelector("#ba-out").textContent = `Authorization: Basic ${b64}`;
      el.querySelector("#ba-b64").textContent = b64;
      current = `Authorization: Basic ${b64}`;
    }
    let current;
    [user, pass].forEach(e => e.addEventListener("input", run));
    el.querySelector("#ba-copy").append(makeCopyButton(() => current));
    run();
  }
});

/* ============== Slugify ============== */
registerTool("slugify-string", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">Text</label>
        <input class="input" id="sl-in" value="Hello, World! — A Quick Brown Fox.">
        <div class="row">
          <label class="field-label" style="margin:0;">Separator</label>
          <input class="input" id="sl-sep" value="-" style="max-width:80px;">
        </div>
        <label class="field-label">Slug</label>
        <div class="output-box" id="sl-out" style="font-size:var(--fs-md);"></div>
        <div id="sl-copy"></div>
      </div>`;
    const inp = el.querySelector("#sl-in");
    const sep = el.querySelector("#sl-sep");
    function run() {
      const s = inp.value.toString().normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
        .toLowerCase().replace(/[^a-z0-9]+/g, sep.value || "-").replace(new RegExp(`^${sep.value}+|${sep.value}+$`,"g"),"");
      el.querySelector("#sl-out").textContent = s || "—";
      current = s;
    }
    let current;
    [inp, sep].forEach(e => e.addEventListener("input", run));
    el.querySelector("#sl-copy").append(makeCopyButton(() => current));
    run();
  }
});

/* ============== JSON diff ============== */
registerTool("json-diff", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2">
        <div class="stack">
          <label class="field-label">Left JSON</label>
          <textarea class="textarea" id="jd-l">{"a":1,"b":2,"c":3}</textarea>
        </div>
        <div class="stack">
          <label class="field-label">Right JSON</label>
          <textarea class="textarea" id="jd-r">{"a":1,"b":20,"d":4}</textarea>
        </div>
      </div>
      <label class="field-label" style="margin-top:var(--sp-4);">Diff</label>
      <div class="output-box scroll" id="jd-out"></div>`;
    const L = el.querySelector("#jd-l");
    const R = el.querySelector("#jd-r");
    const out = el.querySelector("#jd-out");
    function run() {
      try {
        const a = JSON.parse(L.value || "{}");
        const b = JSON.parse(R.value || "{}");
        const allKeys = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
        if (!allKeys.length) { out.innerHTML = `<span class="muted-line">No keys.</span>`; return; }
        out.innerHTML = allKeys.map(k => {
          if (!(k in a)) return `<div style="padding:3px 0;"><span class="tag tag-add">+ ${escapeHtml(k)}</span> <span style="color:var(--diff-add-fg);">${escapeHtml(JSON.stringify(b[k]))}</span></div>`;
          if (!(k in b)) return `<div style="padding:3px 0;"><span class="tag tag-del">− ${escapeHtml(k)}</span> <span style="color:var(--diff-del-fg);">${escapeHtml(JSON.stringify(a[k]))}</span></div>`;
          if (JSON.stringify(a[k]) !== JSON.stringify(b[k]))
            return `<div style="padding:3px 0;"><span class="tag">~ ${escapeHtml(k)}</span><br><span style="color:var(--diff-del-fg);">- ${escapeHtml(JSON.stringify(a[k]))}</span><br><span style="color:var(--diff-add-fg);">+ ${escapeHtml(JSON.stringify(b[k]))}</span></div>`;
          return `<div style="padding:3px 0;color:var(--muted-2);">= ${escapeHtml(k)}: ${escapeHtml(JSON.stringify(a[k]))}</div>`;
        }).join("");
      } catch (e) { out.innerHTML = `<span style="color:var(--rose)">Invalid JSON: ${e.message}</span>`; }
    }
    L.addEventListener("input", debounce(run, 100));
    R.addEventListener("input", debounce(run, 100));
    run();
  }
});
