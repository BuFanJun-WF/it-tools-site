/* =========================================================================
   Converter tools
   ========================================================================= */
import { icons } from "../icons.js";
import { registerTool } from "../views/tool.js";
import { escapeHtml, makeCopyButton, copyText, flashCopy, debounce, parseJSON } from "../utils.js";
import { TomlWriter, TomlReader } from "./toml.js";

/* ============== Base64 string ============== */
registerTool("base64-string-converter", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row" style="justify-content:flex-end;">
          <button class="btn btn-sm btn-ghost" id="b64-swap">${icons.swap} Swap</button>
        </div>
        <div class="grid-2">
          <div class="stack">
            <label class="field-label">Plain text</label>
            <textarea class="textarea" id="b64-plain">Hello, world!</textarea>
          </div>
          <div class="stack">
            <label class="field-label">Base64</label>
            <textarea class="textarea" id="b64-b64"></textarea>
          </div>
        </div>
        <div id="b64-err" class="muted-line"></div>
      </div>`;
    const plain = el.querySelector("#b64-plain");
    const b64 = el.querySelector("#b64-b64");
    const err = el.querySelector("#b64-err");
    function enc() {
      try {
        // utf-8 safe
        b64.value = btoa(unescape(encodeURIComponent(plain.value)));
        err.textContent = "";
      } catch (e) { err.textContent = "encode error: " + e.message; }
    }
    function dec() {
      try {
        plain.value = decodeURIComponent(escape(atob(b64.value)));
        err.textContent = "";
      } catch (e) { err.textContent = "invalid base64"; }
    }
    plain.addEventListener("input", enc);
    b64.addEventListener("input", dec);
    el.querySelector("#b64-swap").addEventListener("click", () => { const a = plain.value; plain.value = b64.value; b64.value = a; enc(); });
    enc();
  }
});

/* ============== Base64 file ============== */
registerTool("base64-file-converter", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label" for="bf-file">Choose a file</label>
        <input type="file" id="bf-file" class="input" style="padding:6px;">
        <div>
          <label class="field-label">Base64 / Data URI</label>
          <div class="output-box scroll" id="bf-out" style="min-height:120px;">Pick a file to convert.</div>
        </div>
        <div class="row" id="bf-actions" style="display:none;">
          <button class="btn btn-sm" id="bf-copy">Copy data URI</button>
          <button class="btn btn-sm" id="bf-copy-b64">Copy raw base64</button>
        </div>
      </div>`;
    const file = el.querySelector("#bf-file");
    const out = el.querySelector("#bf-out");
    const acts = el.querySelector("#bf-actions");
    let dataUri = "", raw = "";
    file.addEventListener("change", () => {
      const f = file.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        dataUri = r.result;
        raw = String(r.result).split(",")[1] || "";
        const sizeKb = (f.size / 1024).toFixed(1);
        out.innerHTML = `<div style="margin-bottom:8px;">
            <span class="tag">${escapeHtml(f.name)}</span>
            <span class="tag">${f.type || "unknown"}</span>
            <span class="tag">${sizeKb} KB</span>
            ${f.type.startsWith("image/") ? `<img src="${dataUri}" style="margin-top:10px;max-width:100%;border-radius:var(--r-md);border:1px solid var(--border);">` : ""}
          </div>
          <div style="word-break:break-all;font-size:var(--fs-xs);">${escapeHtml(dataUri.slice(0, 240))}${dataUri.length > 240 ? "…" : ""}</div>`;
        acts.style.display = "flex";
      };
      r.readAsDataURL(f);
    });
    el.querySelector("#bf-copy").addEventListener("click", async (e) => { if (await copyText(dataUri)) flashCopy(e.target); });
    el.querySelector("#bf-copy-b64").addEventListener("click", async (e) => { if (await copyText(raw)) flashCopy(e.target); });
  }
});

/* ============== JSON prettify ============== */
registerTool("json-prettify", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <label class="field-label" style="margin:0;">Indent</label>
          <select class="select" id="jp-indent" style="max-width:140px;">
            <option value="2" selected>2 spaces</option>
            <option value="4">4 spaces</option>
            <option value="\t">Tabs</option>
          </select>
          <button class="btn btn-sm" id="jp-min">Minify</button>
          <span id="jp-status" class="muted-line" style="margin-left:auto;"></span>
        </div>
        <div class="grid-2">
          <div class="stack">
            <label class="field-label">Input</label>
            <textarea class="textarea" id="jp-in">{  "hello":"world",  "arr":[1,2,3]  }</textarea>
          </div>
          <div class="stack">
            <div class="row" style="justify-content:space-between;"><label class="field-label" style="margin:0;">Output</label><div id="jp-copy"></div></div>
            <textarea class="textarea" id="jp-out" readonly></textarea>
          </div>
        </div>
      </div>`;
    const inp = el.querySelector("#jp-in");
    const out = el.querySelector("#jp-out");
    const status = el.querySelector("#jp-status");
    const indent = el.querySelector("#jp-indent");
    function run(min = false) {
      try {
        const v = parseJSON(inp.value);
        out.value = JSON.stringify(v, null, min ? 0 : (indent.value === "\t" ? "\t" : +indent.value));
        status.innerHTML = `<span class="tag tag-add">${icons.check} valid JSON</span>`;
      } catch (e) {
        out.value = "";
        status.innerHTML = `<span class="tag tag-del">${e.message}</span>`;
      }
    }
    let cur;
    const dr = debounce(() => run(), 80);
    inp.addEventListener("input", dr);
    indent.addEventListener("change", dr);
    el.querySelector("#jp-min").addEventListener("click", () => run(true));
    el.querySelector("#jp-copy").append(makeCopyButton(() => out.value));
    run();
  }
});

/* ============== JSON ⇄ YAML ============== */
registerTool("json-to-yaml", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <button class="btn btn-sm btn-primary" id="jy-j2y">JSON → YAML</button>
          <button class="btn btn-sm btn-ghost" id="jy-y2j">YAML → JSON</button>
          <span id="jy-status" class="muted-line" style="margin-left:auto;"></span>
        </div>
        <div class="grid-2">
          <div class="stack"><label class="field-label">JSON</label><textarea class="textarea" id="jy-json">{"name":"Alice","age":30,"roles":["admin","user"]}</textarea></div>
          <div class="stack"><label class="field-label">YAML</label><textarea class="textarea" id="jy-yaml"></textarea></div>
        </div>
      </div>`;
    let mode = "j2y";
    const json = el.querySelector("#jy-json");
    const yaml = el.querySelector("#jy-yaml");
    const status = el.querySelector("#jy-status");
    function run() {
      try {
        if (mode === "j2y") {
          yaml.value = jsyaml.dump(parseJSON(json.value));
        } else {
          json.value = JSON.stringify(jsyaml.load(yaml.value), null, 2);
        }
        status.innerHTML = `<span class="tag tag-add">${icons.check} ok</span>`;
      } catch (e) { status.innerHTML = `<span class="tag tag-del">${e.message}</span>`; }
    }
    function setMode(m) {
      mode = m;
      el.querySelector("#jy-j2y").classList.toggle("btn-primary", m === "j2y");
      el.querySelector("#jy-j2y").classList.toggle("btn-ghost", m !== "j2y");
      el.querySelector("#jy-y2j").classList.toggle("btn-primary", m === "y2j");
      el.querySelector("#jy-y2j").classList.toggle("btn-ghost", m !== "y2j");
    }
    json.addEventListener("input", debounce(() => { if (mode === "j2y") run(); }, 100));
    yaml.addEventListener("input", debounce(() => { if (mode === "y2j") run(); }, 100));
    el.querySelector("#jy-j2y").addEventListener("click", () => { setMode("j2y"); run(); });
    el.querySelector("#jy-y2j").addEventListener("click", () => { setMode("y2j"); run(); });
    run();
  }
});

/* ============== JSON ⇄ TOML ============== */
registerTool("json-to-toml", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <button class="btn btn-sm btn-primary" id="jt-j2t">JSON → TOML</button>
          <button class="btn btn-sm btn-ghost" id="jt-t2j">TOML → JSON</button>
          <span id="jt-status" class="muted-line" style="margin-left:auto;"></span>
        </div>
        <div class="grid-2">
          <div class="stack"><label class="field-label">JSON</label><textarea class="textarea" id="jt-json">{"title":"TOML","owner":{"name":"Tom"}}</textarea></div>
          <div class="stack"><label class="field-label">TOML</label><textarea class="textarea" id="jt-toml"></textarea></div>
        </div>
      </div>`;
    let mode = "j2t";
    const json = el.querySelector("#jt-json");
    const toml = el.querySelector("#jt-toml");
    const status = el.querySelector("#jt-status");
    function run() {
      try {
        if (mode === "j2t") {
          toml.value = TomlWriter.jsonToToml(parseJSON(json.value));
        } else {
          json.value = JSON.stringify(TomlReader.tomlToJson(toml.value), null, 2);
        }
        status.innerHTML = `<span class="tag tag-add">${icons.check} ok</span>`;
      } catch (e) { status.innerHTML = `<span class="tag tag-del">${e.message}</span>`; }
    }
    function setMode(m) {
      mode = m;
      el.querySelector("#jt-j2t").classList.toggle("btn-primary", m === "j2t");
      el.querySelector("#jt-j2t").classList.toggle("btn-ghost", m !== "j2t");
      el.querySelector("#jt-t2j").classList.toggle("btn-primary", m === "t2j");
      el.querySelector("#jt-t2j").classList.toggle("btn-ghost", m !== "t2j");
    }
    json.addEventListener("input", debounce(() => { if (mode === "j2t") run(); }, 100));
    toml.addEventListener("input", debounce(() => { if (mode === "t2j") run(); }, 100));
    el.querySelector("#jt-j2t").addEventListener("click", () => { setMode("j2t"); run(); });
    el.querySelector("#jt-t2j").addEventListener("click", () => { setMode("t2j"); run(); });
    run();
  }
});

/* ============== Case converter ============== */
registerTool("case-converter", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">Input</label>
        <input class="input" id="cc-in" value="hello world example">
        <div id="cc-grid" style="display:grid;grid-template-columns:1fr;gap:var(--sp-2);"></div>
      </div>`;
    const inp = el.querySelector("#cc-in");
    const grid = el.querySelector("#cc-grid");
    const convs = [
      ["camelCase", s => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_,c) => c.toUpperCase())],
      ["PascalCase", s => { const c = s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_,c) => c.toUpperCase()); return c.charAt(0).toUpperCase()+c.slice(1); }],
      ["snake_case", s => s.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g,"_").replace(/^_|_$/g,"")],
      ["kebab-case", s => s.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g,"-").replace(/^-|-$/g,"")],
      ["CONSTANT_CASE", s => s.trim().toUpperCase().replace(/[^a-zA-Z0-9]+/g,"_").replace(/^_|_$/g,"")],
      ["Title Case", s => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase()+t.slice(1).toLowerCase())],
      ["Sentence case", s => { const t = s.toLowerCase(); return t.charAt(0).toUpperCase()+t.slice(1); }],
      ["lowercase", s => s.toLowerCase()],
      ["UPPERCASE", s => s.toUpperCase()],
    ];
    function run() {
      const v = inp.value;
      grid.innerHTML = "";
      convs.forEach(([name, fn]) => {
        const row = document.createElement("div");
        row.style.cssText = "display:grid;grid-template-columns:140px 1fr auto;gap:var(--sp-3);align-items:center;padding:8px 12px;background:var(--surface-2);border-radius:var(--r-md);border:1px solid var(--border-soft);";
        const lab = document.createElement("div");
        lab.textContent = name; lab.style.cssText = "font-family:var(--font-mono);font-size:var(--fs-xs);color:var(--muted);";
        const val = document.createElement("div");
        const out = fn(v) || "—";
        val.textContent = out; val.style.cssText = "font-family:var(--font-mono);font-size:var(--fs-sm);word-break:break-all;";
        row.append(lab, val, makeCopyButton(() => out));
        grid.append(row);
      });
    }
    inp.addEventListener("input", debounce(run, 80));
    run();
  }
});

/* ============== Color converter ============== */
registerTool("color-converter", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2 uneven">
        <div class="stack">
          <label class="field-label">Color picker</label>
          <div class="row">
            <input type="color" id="cl-pick" value="#ff6b35" style="width:64px;height:44px;padding:0;border:1px solid var(--border);border-radius:var(--r-md);background:transparent;cursor:pointer;">
            <input class="input" id="cl-text" value="#ff6b35" style="flex:1;font-family:var(--font-mono);">
          </div>
          <div class="grid-2">
            <div><label class="field-label">Hex</label><div class="output-box" id="cl-hex">#ff6b35</div></div>
            <div><label class="field-label">RGB</label><div class="output-box" id="cl-rgb">rgb(255, 107, 53)</div></div>
            <div><label class="field-label">HSL</label><div class="output-box" id="cl-hsl">hsl(16, 100%, 60%)</div></div>
            <div><label class="field-label">CMYK</label><div class="output-box" id="cl-cmyk">—</div></div>
          </div>
        </div>
        <div class="stack">
          <label class="field-label">Preview</label>
          <div id="cl-prev" style="height:200px;border-radius:var(--r-lg);border:1px solid var(--border);background:#ff6b35;"></div>
          <label class="field-label">Shades</label>
          <div id="cl-shades" style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;"></div>
        </div>
      </div>`;
    const pick = el.querySelector("#cl-pick");
    const text = el.querySelector("#cl-text");
    let r=255,g=107,b=53;

    function hexToRgb(h) {
      h = h.replace("#","").trim();
      if (h.length === 3) h = h.split("").map(c=>c+c).join("");
      if (!/^[0-9a-f]{6}$/i.test(h)) return null;
      return { r: parseInt(h.slice(0,2),16), g: parseInt(h.slice(2,4),16), b: parseInt(h.slice(4,6),16) };
    }
    function rgbToHsl(r,g,b) {
      r/=255; g/=255; b/=255;
      const max=Math.max(r,g,b), min=Math.min(r,g,b);
      let h=0,s=0,l=(max+min)/2;
      if (max!==min) {
        const d = max-min;
        s = l>0.5 ? d/(2-max-min) : d/(max+min);
        switch(max) {
          case r: h = (g-b)/d + (g<b?6:0); break;
          case g: h = (b-r)/d + 2; break;
          case b: h = (r-g)/d + 4; break;
        }
        h /= 6;
      }
      return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
    }
    function rgbToCmyk(r,g,b) {
      const rr=r/255, gg=g/255, bb=b/255;
      const k = 1 - Math.max(rr,gg,bb);
      if (k === 1) return { c:0,m:0,y:0,k:100 };
      const c = (1-rr-k)/(1-k), m = (1-gg-k)/(1-k), y = (1-bb-k)/(1-k);
      return { c: Math.round(c*100), m: Math.round(m*100), y: Math.round(y*100), k: Math.round(k*100) };
    }
    function shade(hex, percent) {
      const rgb = hexToRgb(hex);
      const t = percent < 0 ? 0 : 255;
      const p = Math.abs(percent) / 100;
      const r2 = Math.round((t - rgb.r) * p + rgb.r);
      const g2 = Math.round((t - rgb.g) * p + rgb.g);
      const b2 = Math.round((t - rgb.b) * p + rgb.b);
      return "#" + [r2,g2,b2].map(v => v.toString(16).padStart(2,"0")).join("");
    }
    function update(hex) {
      const rgb = hexToRgb(hex);
      if (!rgb) return;
      r = rgb.r; g = rgb.g; b = rgb.b;
      pick.value = "#" + [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("");
      text.value = pick.value;
      el.querySelector("#cl-prev").style.background = pick.value;
      const hsl = rgbToHsl(r,g,b);
      const cmyk = rgbToCmyk(r,g,b);
      el.querySelector("#cl-hex").textContent = pick.value;
      el.querySelector("#cl-rgb").textContent = `rgb(${r}, ${g}, ${b})`;
      el.querySelector("#cl-hsl").textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      el.querySelector("#cl-cmyk").textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
      const shades = el.querySelector("#cl-shades");
      shades.innerHTML = "";
      [-60,-40,-20,0,20,40,60,80].forEach(p => {
        const s = shade(pick.value, p);
        const sw = document.createElement("div");
        sw.style.cssText = `height:36px;border-radius:6px;background:${s};cursor:pointer;border:1px solid rgba(255,255,255,.08);`;
        sw.title = s;
        sw.addEventListener("click", () => update(s));
        shades.append(sw);
      });
    }
    pick.addEventListener("input", () => update(pick.value));
    text.addEventListener("input", debounce(() => {
      const rgb = hexToRgb(text.value);
      if (rgb) update(text.value);
    }, 200));
    update("#ff6b35");
  }
});

/* ============== Text ⇄ binary ============== */
registerTool("text-to-binary", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2">
        <div class="stack">
          <label class="field-label">Text</label>
          <textarea class="textarea" id="tb-text">hello</textarea>
        </div>
        <div class="stack">
          <label class="field-label">Binary (8-bit)</label>
          <textarea class="textarea" id="tb-bin"></textarea>
        </div>
      </div>`;
    const text = el.querySelector("#tb-text");
    const bin = el.querySelector("#tb-bin");
    text.addEventListener("input", () => {
      bin.value = Array.from(text.value).map(c => c.codePointAt(0).toString(2).padStart(8,"0")).join(" ");
    });
    bin.addEventListener("input", () => {
      try {
        text.value = bin.value.trim().split(/\s+/).map(b => String.fromCodePoint(parseInt(b, 2))).join("");
      } catch {}
    });
    text.dispatchEvent(new Event("input"));
  }
});

/* ============== NATO alphabet ============== */
registerTool("text-to-nato-alphabet", {
  mount(el) {
    const nato = { A:"Alfa",B:"Bravo",C:"Charlie",D:"Delta",E:"Echo",F:"Foxtrot",G:"Golf",H:"Hotel",I:"India",J:"Juliett",K:"Kilo",L:"Lima",M:"Mike",N:"November",O:"Oscar",P:"Papa",Q:"Quebec",R:"Romeo",S:"Sierra",T:"Tango",U:"Uniform",V:"Victor",W:"Whiskey",X:"X-ray",Y:"Yankee",Z:"Zulu",0:"Zero",1:"One",2:"Two",3:"Three",4:"Four",5:"Five",6:"Six",7:"Seven",8:"Eight",9:"Niner" };
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">Text</label>
        <input class="input" id="nt-in" value="SOS">
        <label class="field-label">Phonetic</label>
        <div class="output-box" id="nt-out" style="line-height:2;"></div>
      </div>`;
    const inp = el.querySelector("#nt-in");
    const out = el.querySelector("#nt-out");
    function run() {
      out.innerHTML = Array.from(inp.value.toUpperCase()).map(c => {
        if (c === " ") return `<span style="color:var(--muted-2)">·</span>`;
        const w = nato[c];
        return w ? `<span class="tag tag-accent" style="margin:2px;">${c} — ${w}</span>` : `<span class="tag">${escapeHtml(c)}</span>`;
      }).join(" ");
    }
    inp.addEventListener("input", run);
    run();
  }
});

/* ============== Integer base converter ============== */
registerTool("integer-base-converter", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">Value</label>
        <input class="input" id="ib-in" value="255" style="font-family:var(--font-mono);font-size:var(--fs-md);">
        <div class="grid-2">
          <div><label class="field-label">Binary (2)</label><div class="output-box" id="ib-2">—</div></div>
          <div><label class="field-label">Octal (8)</label><div class="output-box" id="ib-8">—</div></div>
          <div><label class="field-label">Decimal (10)</label><div class="output-box" id="ib-10">—</div></div>
          <div><label class="field-label">Hex (16)</label><div class="output-box" id="ib-16">—</div></div>
          <div><label class="field-label">Base36</label><div class="output-box" id="ib-36">—</div></div>
          <div><label class="field-label">Base64</label><div class="output-box" id="ib-64">—</div></div>
        </div>
      </div>`;
    const inp = el.querySelector("#ib-in");
    function run() {
      let v;
      const raw = inp.value.trim();
      try {
        if (/^0x[0-9a-f]+$/i.test(raw)) v = BigInt(raw);
        else if (/^[01]+$/i.test(raw)) v = BigInt("0b"+raw);
        else if (/^[0-9]+$/i.test(raw)) v = BigInt(raw);
        else v = BigInt(raw);
      } catch { v = null; }
      ["2","8","10","16","36","64"].forEach(b => {
        const elBox = el.querySelector("#ib-"+b);
        if (v === null) { elBox.textContent = "—"; return; }
        if (b === "64") {
          elBox.textContent = btoa(String.fromCharCode(...new Uint8Array(new BigUint64Array([v]).buffer)));
        } else {
          elBox.textContent = v.toString(+b).toUpperCase();
        }
      });
    }
    inp.addEventListener("input", debounce(run, 80));
    run();
  }
});

/* ============== Date-time converter ============== */
registerTool("date-time-converter", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <input type="datetime-local" class="input" id="dt-pick" step="1">
          <button class="btn btn-sm" id="dt-now">Now</button>
        </div>
        <dl class="kv">
          <dt>ISO 8601</dt><dd id="dt-iso">—</dd>
          <dt>Unix (s)</dt><dd id="dt-unix">—</dd>
          <dt>Unix (ms)</dt><dd id="dt-ms">—</dd>
          <dt>UTC</dt><dd id="dt-utc">—</dd>
          <dt>Local</dt><dd id="dt-local">—</dd>
          <dt>Relative</dt><dd id="dt-rel">—</dd>
          <dt>Day of week</dt><dd id="dt-dow">—</dd>
          <dt>Week of year</dt><dd id="dt-week">—</dd>
        </dl>
        <div class="row"><label class="field-label" style="margin:0;">Or parse a value:</label><input class="input" id="dt-parse" placeholder="2024-01-01 / 1700000000 / ISO" style="flex:1;font-family:var(--font-mono);"></div>
      </div>`;
    const pick = el.querySelector("#dt-pick");
    function pad(n) { return String(n).padStart(2,"0"); }
    function isoLocal(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; }
    function weekOfYear(d) {
      const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
      const day = date.getUTCDay() || 7;
      date.setUTCDate(date.getUTCDate() + 4 - day);
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
      return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    }
    function rel(d) {
      const diff = d - Date.now();
      const abs = Math.abs(diff);
      const days = Math.floor(abs / 86400000);
      const dir = diff < 0 ? "ago" : "from now";
      if (days === 0) return "today";
      if (days < 30) return `${days} day${days>1?"s":""} ${dir}`;
      if (days < 365) return `${Math.floor(days/30)} month${days>=60?"s":""} ${dir}`;
      return `${Math.floor(days/365)} year${days>=730?"s":""} ${dir}`;
    }
    function render(d) {
      pick.value = isoLocal(d);
      el.querySelector("#dt-iso").textContent = d.toISOString();
      el.querySelector("#dt-unix").textContent = Math.floor(d.getTime()/1000);
      el.querySelector("#dt-ms").textContent = d.getTime();
      el.querySelector("#dt-utc").textContent = d.toUTCString();
      el.querySelector("#dt-local").textContent = d.toString();
      el.querySelector("#dt-rel").textContent = rel(d);
      el.querySelector("#dt-dow").textContent = d.toLocaleDateString("en-US",{weekday:"long"});
      el.querySelector("#dt-week").textContent = "Week " + weekOfYear(d);
    }
    pick.addEventListener("input", () => { const d = new Date(pick.value); if (!isNaN(d)) render(d); });
    el.querySelector("#dt-now").addEventListener("click", () => render(new Date()));
    el.querySelector("#dt-parse").addEventListener("input", debounce((e) => {
      const v = e.target.value.trim();
      if (!v) return;
      let d;
      if (/^\d{10}$/.test(v)) d = new Date(+v * 1000);
      else if (/^\d{13}$/.test(v)) d = new Date(+v);
      else d = new Date(v);
      if (!isNaN(d)) render(d);
    }, 150));
    render(new Date());
  }
});

/* ============== Roman numerals ============== */
registerTool("roman-numeral-converter", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2">
        <div class="stack">
          <label class="field-label">Number → Roman</label>
          <input class="input" id="rn-num" type="number" value="2024" style="font-family:var(--font-mono);">
          <div class="output-box" id="rn-out">—</div>
        </div>
        <div class="stack">
          <label class="field-label">Roman → Number</label>
          <input class="input" id="rn-rom" value="MMXXIV" style="font-family:var(--font-mono);">
          <div class="output-box" id="rn-back">—</div>
        </div>
      </div>`;
    const map = [["M",1000],["CM",900],["D",500],["CD",400],["C",100],["XC",90],["L",50],["XL",40],["X",10],["IX",9],["V",5],["IV",4],["I",1]];
    function toRoman(n) {
      n = Math.floor(n); if (n < 1 || n > 3999) return "out of range (1–3999)";
      let out = "";
      for (const [s,v] of map) while (n >= v) { out += s; n -= v; }
      return out;
    }
    function fromRoman(s) {
      const valid = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i.test(s);
      if (!valid) return "invalid";
      let total = 0, i = 0;
      while (i < s.length) {
        const two = map.find(([sym]) => sym.toLowerCase() === s.substr(i,2).toLowerCase());
        if (two) { total += two[1]; i += 2; }
        else { const one = map.find(([sym]) => sym.toLowerCase() === s[i].toLowerCase()); total += one[1]; i++; }
      }
      return total;
    }
    const num = el.querySelector("#rn-num");
    const rom = el.querySelector("#rn-rom");
    num.addEventListener("input", () => el.querySelector("#rn-out").textContent = toRoman(+num.value));
    rom.addEventListener("input", () => el.querySelector("#rn-back").textContent = fromRoman(rom.value));
    num.dispatchEvent(new Event("input"));
    rom.dispatchEvent(new Event("input"));
  }
});

/* ============== YAML viewer / prettify ============== */
registerTool("yaml-viewer", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">YAML input</label>
        <textarea class="textarea" id="yv-in">name:  it-tools
tags:
  - dev
  - tools
nested:
  enabled: true</textarea>
        <div class="row" style="justify-content:space-between;">
          <label class="field-label" style="margin:0;">Pretty output</label>
          <div id="yv-copy"></div>
        </div>
        <textarea class="textarea" id="yv-out" readonly></textarea>
      </div>`;
    const inp = el.querySelector("#yv-in");
    const out = el.querySelector("#yv-out");
    function run() {
      try {
        out.value = jsyaml.dump(jsyaml.load(inp.value));
        out.style.color = "";
      } catch (e) { out.value = "Error: " + e.message; out.style.color = "var(--rose)"; }
    }
    inp.addEventListener("input", debounce(run, 100));
    el.querySelector("#yv-copy").append(makeCopyButton(() => out.value));
    run();
  }
});
