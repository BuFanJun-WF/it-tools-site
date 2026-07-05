/* =========================================================================
   Network, Math, Measurement, Text, Data tools
   ========================================================================= */
import { icons } from "../icons.js";
import { registerTool } from "../views/tool.js";
import { escapeHtml, makeCopyButton, debounce } from "../utils.js";

/* ============== IPv4 subnet calculator ============== */
registerTool("ipv4-subnet-calculator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">CIDR block</label>
        <input class="input" id="sn-in" value="192.168.1.0/24" style="font-family:var(--font-mono);">
        <dl class="kv" id="sn-out"></dl>
      </div>`;
    const inp = el.querySelector("#sn-in");
    function run() {
      const m = inp.value.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
      const out = el.querySelector("#sn-out");
      if (!m) { out.innerHTML = `<dt>Error</dt><dd style="color:var(--rose);">Use the form a.b.c.d/n (e.g. 192.168.0.0/24).</dd>`; return; }
      const oct = [+m[1],+m[2],+m[3],+m[4]];
      if (oct.some(o => o > 255)) { out.innerHTML = `<dt>Error</dt><dd style="color:var(--rose);">Octet out of range.</dd>`; return; }
      const cidr = +m[5];
      if (cidr > 32) { out.innerHTML = `<dt>Error</dt><dd style="color:var(--rose);">CIDR must be 0–32.</dd>`; return; }
      const ipInt = (oct[0]<<24) | (oct[1]<<16) | (oct[2]<<8) | oct[3];
      const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
      const net = (ipInt & mask) >>> 0;
      const broadcast = (net | ~mask) >>> 0;
      const total = cidr >= 31 ? (cidr === 31 ? 2 : 1) : (2 ** (32 - cidr) - 2);
      const wildcard = (~mask) >>> 0;
      const intToIp = n => [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join(".");
      const maskBinary = mask.toString(2).padStart(32,"0").match(/.{8}/g).join(".");
      out.innerHTML = `
        <dt>Network address</dt><dd>${intToIp(net)}</dd>
        <dt>Broadcast</dt><dd>${intToIp(broadcast)}</dd>
        <dt>Subnet mask</dt><dd>${intToIp(mask)}</dd>
        <dt>Wildcard</dt><dd>${intToIp(wildcard)}</dd>
        <dt>CIDR</dt><dd>/${cidr}</dd>
        <dt>Mask (binary)</dt><dd>${maskBinary}</dd>
        <dt>Usable hosts</dt><dd>${total}</dd>
        <dt>Host range</dt><dd>${cidr>=31?intToIp(net):intToIp(net+1)} — ${cidr>=31?intToIp(broadcast):intToIp(broadcast-1)}</dd>
        <dt>IP class</dt><dd>${oct[0]<128?"A":oct[0]<192?"B":oct[0]<224?"C":oct[0]<240?"D":"E"}</dd>
      `;
    }
    inp.addEventListener("input", debounce(run, 80));
    run();
  }
});

/* ============== IPv4 address converter ============== */
registerTool("ipv4-address-converter", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">IPv4 address</label>
        <input class="input" id="ac-in" value="192.168.1.42" style="font-family:var(--font-mono);">
        <dl class="kv" id="ac-out"></dl>
      </div>`;
    const inp = el.querySelector("#ac-in");
    function run() {
      const m = inp.value.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
      const out = el.querySelector("#ac-out");
      if (!m || m.slice(1).some(s => +s > 255)) { out.innerHTML = `<dt>Error</dt><dd style="color:var(--rose);">Invalid IPv4 address.</dd>`; return; }
      const [a,b,c,d] = [+m[1],+m[2],+m[3],+m[4]];
      const int = (a<<24)|(b<<16)|(c<<8)|d;
      const bin = [a,b,c,d].map(x => x.toString(2).padStart(8,"0")).join(".");
      const hex = "0x" + [a,b,c,d].map(x => x.toString(16).padStart(2,"0")).join("");
      const ipv6 = `::ffff:${a.toString(16).padStart(2,"0")}${b.toString(16).padStart(2,"0")}:${c.toString(16).padStart(2,"0")}${d.toString(16).padStart(2,"0")}`;
      out.innerHTML = `
        <dt>Decimal</dt><dd>${int >>> 0}</dd>
        <dt>Hexadecimal</dt><dd>${hex}</dd>
        <dt>Binary</dt><dd>${bin}</dd>
        <dt>Octal</dt><dd>0${(int>>>0).toString(8)}</dd>
        <dt>IPv6 (mapped)</dt><dd>${ipv6}</dd>
      `;
    }
    inp.addEventListener("input", debounce(run, 80));
    run();
  }
});

/* ============== MAC address generator ============== */
registerTool("mac-address-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <div><label class="field-label">Quantity</label><input class="input" id="mg-count" type="number" value="10" min="1" max="200" style="max-width:100px;"></div>
          <div><label class="field-label">Prefix (optional)</label><input class="input" id="mg-prefix" placeholder="00:1B:44" style="font-family:var(--font-mono);"></div>
          <div>
            <label class="field-label">Case</label>
            <select class="select" id="mg-case">
              <option value="upper">Uppercase</option>
              <option value="lower">lowercase</option>
            </select>
          </div>
          <div>
            <label class="field-label">Separator</label>
            <select class="select" id="mg-sep">
              <option value=":">:</option>
              <option value="-">-</option>
              <option value="">none</option>
            </select>
          </div>
          <button class="btn btn-primary" id="mg-gen" style="align-self:flex-end;">${icons.refresh} Generate</button>
        </div>
        <div class="output-box scroll" id="mg-out" style="min-height:280px;"></div>
      </div>`;
    const out = el.querySelector("#mg-out");
    function run() {
      const n = Math.max(1, Math.min(200, +el.querySelector("#mg-count").value || 10));
      const prefix = el.querySelector("#mg-prefix").value.trim().split(/[:\-]/).filter(Boolean);
      const sep = el.querySelector("#mg-sep").value;
      const upper = el.querySelector("#mg-case").value === "upper";
      out.innerHTML = "";
      for (let i = 0; i < n; i++) {
        const bytes = [];
        for (let j = 0; j < 6; j++) bytes.push(j < prefix.length ? parseInt(prefix[j], 16) : crypto.getRandomValues(new Uint8Array(1))[0]);
        // set local bit (locally administered) on first byte if no prefix
        if (!prefix.length) bytes[0] = (bytes[0] & 0xFE) | 0x02;
        let mac = bytes.map(b => (upper ? b.toString(16).toUpperCase() : b.toString(16).padStart(2,"0")).padStart(2,"0")).join(sep);
        if (!upper) mac = mac.toLowerCase();
        const row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--border-soft);";
        const span = document.createElement("span");
        span.style.cssText = "flex:1;color:var(--accent-text);";
        span.textContent = mac;
        row.append(span, makeCopyButton(() => mac));
        out.append(row);
      }
    }
    el.querySelector("#mg-gen").addEventListener("click", run);
    run();
  }
});

/* ============== Math evaluator ============== */
registerTool("math-evaluator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">Expression</label>
        <input class="input" id="me-in" value="2 + 3 * sqrt(16) - 0.5" style="font-family:var(--font-mono);font-size:var(--fs-md);">
        <div class="output-box" id="me-out" style="font-size:var(--fs-xl);font-weight:700;color:var(--accent-text);">—</div>
        <details style="margin-top:var(--sp-3);">
          <summary style="cursor:pointer;color:var(--accent-text);font-size:var(--fs-sm);">Available functions</summary>
          <div class="muted-line" style="margin-top:var(--sp-2);font-family:var(--font-mono);font-size:var(--fs-xs);">
            sqrt, cbrt, abs, exp, log, log2, log10, pow, round, floor, ceil, sign,
            sin, cos, tan, asin, acos, atan, atan2, sinh, cosh, tanh,
            min, max, PI, E, LN2, constants.
          </div>
        </details>
      </div>`;
    const inp = el.querySelector("#me-in");
    const out = el.querySelector("#me-out");
    function run() {
      try {
        const expr = inp.value
          .replace(/π/g, "PI").replace(/\^/g, "**")
          .replace(/(\d)([a-zA-Z(])/g, "$1*$2"); // 2( → 2*( , 2sin → 2*sin
        // Build a sandboxed function with Math functions/constants in scope.
        // Math's properties are non-enumerable, so we list them explicitly.
        const mathNames = ["sqrt","cbrt","abs","sign","exp","log","log2","log10","pow",
          "round","floor","ceil","trunc","min","max","hypot","random",
          "sin","cos","tan","asin","acos","atan","atan2","sinh","cosh","tanh","asinh","acosh","atanh",
          "PI","E","LN2","LN10","LOG2E","LOG10E","SQRT2","SQRT1_2"];
        const mathValues = mathNames.map(n => Math[n]);
        const fn = new Function(...mathNames, `"use strict"; return (${expr});`);
        const r = fn(...mathValues);
        if (typeof r !== "number" || !isFinite(r)) throw new Error("not a number");
        out.textContent = Number.isInteger(r) ? r : parseFloat(r.toPrecision(12)).toString();
        out.style.color = "var(--accent-text)";
      } catch (e) { out.textContent = "Error: " + e.message; out.style.color = "var(--rose)"; }
    }
    inp.addEventListener("input", debounce(run, 120));
    run();
  }
});

/* ============== Percentage calculator ============== */
registerTool("percentage-calculator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="output-box" style="padding:var(--sp-4);">
          <div style="margin-bottom:var(--sp-3);font-size:var(--fs-sm);color:var(--muted);">What is <input id="pc-a" class="input" style="display:inline-block;width:90px;padding:4px 8px;" type="number" value="20"> % of <input id="pc-b" class="input" style="display:inline-block;width:120px;padding:4px 8px;" type="number" value="150">?</div>
          <div class="output-box" id="pc-r1" style="background:transparent;border:none;padding:0;color:var(--accent-text);font-size:var(--fs-lg);">—</div>
        </div>
        <div class="output-box" style="padding:var(--sp-4);">
          <div style="margin-bottom:var(--sp-3);font-size:var(--fs-sm);color:var(--muted);"><input id="pc-c" class="input" style="display:inline-block;width:120px;padding:4px 8px;" type="number" value="30"> is what % of <input id="pc-d" class="input" style="display:inline-block;width:120px;padding:4px 8px;" type="number" value="150">?</div>
          <div class="output-box" id="pc-r2" style="background:transparent;border:none;padding:0;color:var(--accent-text);font-size:var(--fs-lg);">—</div>
        </div>
        <div class="output-box" style="padding:var(--sp-4);">
          <div style="margin-bottom:var(--sp-3);font-size:var(--fs-sm);color:var(--muted);">% change from <input id="pc-e" class="input" style="display:inline-block;width:120px;padding:4px 8px;" type="number" value="100"> to <input id="pc-f" class="input" style="display:inline-block;width:120px;padding:4px 8px;" type="number" value="125">?</div>
          <div class="output-box" id="pc-r3" style="background:transparent;border:none;padding:0;color:var(--accent-text);font-size:var(--fs-lg);">—</div>
        </div>
      </div>`;
    function run() {
      const a = +el.querySelector("#pc-a").value, b = +el.querySelector("#pc-b").value;
      const c = +el.querySelector("#pc-c").value, d = +el.querySelector("#pc-d").value;
      const e = +el.querySelector("#pc-e").value, f = +el.querySelector("#pc-f").value;
      el.querySelector("#pc-r1").textContent = b ? ((a/100) * b).toLocaleString() : "—";
      el.querySelector("#pc-r2").textContent = d ? (c/d*100).toFixed(2) + " %" : "—";
      el.querySelector("#pc-r3").textContent = e ? ((f-e)/e*100 >= 0 ? "+" : "") + ((f-e)/e*100).toFixed(2) + " %" : "—";
    }
    el.querySelectorAll("input").forEach(i => i.addEventListener("input", run));
    run();
  }
});

/* ============== Chronometer ============== */
registerTool("chronometer", {
  mount(el) {
    el.innerHTML = `
      <div class="stack" style="align-items:center;">
        <div id="ch-time" style="font-family:var(--font-display);font-size:clamp(48px,12vw,96px);font-weight:700;color:var(--text-strong);letter-spacing:-0.04em;font-variant-numeric:tabular-nums;">00:00.00</div>
        <div class="row">
          <button class="btn btn-primary" id="ch-start">${icons.play} Start</button>
          <button class="btn" id="ch-lap">Lap</button>
          <button class="btn" id="ch-reset">Reset</button>
        </div>
        <div id="ch-laps" style="width:100%;max-width:400px;"></div>
      </div>`;
    let raf = null, startT = 0, elapsed = 0, laps = [];
    const time = el.querySelector("#ch-time");
    const btn = el.querySelector("#ch-start");
    function fmt(ms) {
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      const cs = Math.floor((ms % 1000) / 10);
      return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}.${String(cs).padStart(2,"0")}`;
    }
    function tick() {
      time.textContent = fmt(elapsed + (startT ? performance.now() - startT : 0));
      raf = requestAnimationFrame(tick);
    }
    btn.addEventListener("click", () => {
      if (raf) {
        elapsed += performance.now() - startT;
        startT = 0;
        cancelAnimationFrame(raf); raf = null;
        btn.innerHTML = `${icons.play} Resume`;
      } else {
        startT = performance.now();
        tick();
        btn.innerHTML = `${icons.pause} Pause`;
      }
    });
    el.querySelector("#ch-lap").addEventListener("click", () => {
      const now = elapsed + (startT ? performance.now() - startT : 0);
      laps.unshift(now);
      el.querySelector("#ch-laps").innerHTML = laps.map((t,i) => `<div style="display:flex;justify-content:space-between;padding:8px 12px;border-bottom:1px solid var(--border-soft);"><span style="color:var(--muted);font-size:var(--fs-xs);">Lap ${laps.length - i}</span><span style="font-family:var(--font-mono);">${fmt(t)}</span></div>`).join("");
    });
    el.querySelector("#ch-reset").addEventListener("click", () => {
      cancelAnimationFrame(raf); raf = null; elapsed = 0; startT = 0;
      time.textContent = "00:00.00";
      btn.innerHTML = `${icons.play} Start`;
      laps = []; el.querySelector("#ch-laps").innerHTML = "";
    });
    tick();
  }
});

/* ============== Temperature converter ============== */
registerTool("temperature-converter", {
  mount(el) {
    const units = [
      ["Celsius","°C", c => c, v => v],
      ["Fahrenheit","°F", c => c*9/5+32, f => (f-32)*5/9],
      ["Kelvin","K", c => c+273.15, k => k-273.15],
      ["Rankine","°R", c => (c+273.15)*9/5, r => (r*5/9)-273.15],
      ["Delisle","°De", c => (100-c)*3/2, d => 100 - d*2/3],
      ["Newton","°N", c => c*33/100, n => n*100/33],
      ["Réaumur","°Ré", c => c*4/5, re => re*5/4],
      ["Rømer","°Rø", c => c*21/40+7.5, ro => (ro-7.5)*40/21],
    ];
    el.innerHTML = `<div class="stack">${units.map(([name,sym],i) => `
      <div class="row" style="gap:var(--sp-3);">
        <label style="width:140px;font-size:var(--fs-sm);">${name} <span class="muted-line">${sym}</span></label>
        <input class="input" data-u="${i}" value="${i===0?20:""}" style="font-family:var(--font-mono);" type="number" step="0.01">
      </div>`).join("")}</div>`;
    const inputs = el.querySelectorAll("input[data-u]");
    function updateAll(fromIdx, value) {
      const celsius = units[fromIdx][3](+value);
      units.forEach(([,, toC], i) => { if (i !== fromIdx) inputs[i].value = (Math.round(toC(celsius)*100)/100); });
    }
    inputs.forEach(inp => inp.addEventListener("input", () => {
      updateAll(+inp.dataset.u, inp.value);
    }));
    updateAll(0, 20);
  }
});

/* ============== Lorem ipsum ============== */
registerTool("lorem-ipsum-generator", {
  mount(el) {
    const words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <label class="field-label" style="margin:0;">Count</label>
          <input class="input" id="li-count" type="number" value="3" min="1" max="100" style="max-width:90px;">
          <select class="select" id="li-unit" style="max-width:140px;">
            <option value="paragraphs" selected>Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
          <button class="btn btn-primary" id="li-gen">${icons.refresh} Generate</button>
          <div style="margin-left:auto;"><span class="tag" id="li-stats"></span></div>
        </div>
        <div class="row" style="justify-content:flex-end;"><div id="li-copy"></div></div>
        <textarea class="textarea" id="li-out" readonly style="min-height:260px;"></textarea>
      </div>`;
    function rnd(n){return Math.floor(Math.random()*n);}
    function sentence() {
      const len = 8 + rnd(8);
      const arr = Array.from({length: len}, () => words[rnd(words.length)]);
      arr[0] = arr[0][0].toUpperCase() + arr[0].slice(1);
      return arr.join(" ") + ".";
    }
    function paragraph() {
      const len = 3 + rnd(4); return Array.from({length: len}, sentence).join(" ");
    }
    function run() {
      const n = Math.max(1, Math.min(100, +el.querySelector("#li-count").value || 1));
      const unit = el.querySelector("#li-unit").value;
      let text = "";
      if (unit === "paragraphs") text = Array.from({length:n}, paragraph).join("\n\n");
      else if (unit === "sentences") text = Array.from({length:n}, sentence).join(" ");
      else text = Array.from({length:n}, () => words[rnd(words.length)]).join(" ");
      el.querySelector("#li-out").value = text;
      el.querySelector("#li-stats").textContent = `${text.split(/\s+/).length} words`;
    }
    el.querySelector("#li-gen").addEventListener("click", run);
    el.querySelector("#li-copy").append(makeCopyButton(() => el.querySelector("#li-out").value));
    run();
  }
});

/* ============== Text statistics ============== */
registerTool("text-statistics", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">Text</label>
        <textarea class="textarea" id="ts-in">The quick brown fox jumps over the lazy dog.</textarea>
        <dl class="kv" id="ts-out"></dl>
      </div>`;
    const inp = el.querySelector("#ts-in");
    function run() {
      const s = inp.value;
      const words = (s.match(/\S+/g) || []).length;
      const lines = s ? s.split(/\r\n|\r|\n/).length : 0;
      const sentences = (s.match(/[.!?]+(\s|$)/g) || []).length;
      const bytes = new Blob([s]).size;
      const readMins = words / 200;
      const readStr = readMins < 1 ? `${Math.round(readMins*60)} sec` : `${Math.round(readMins)} min`;
      el.querySelector("#ts-out").innerHTML = `
        <dt>Characters</dt><dd>${s.length}</dd>
        <dt>Characters (no spaces)</dt><dd>${s.replace(/\s/g,"").length}</dd>
        <dt>Words</dt><dd>${words}</dd>
        <dt>Sentences</dt><dd>${sentences}</dd>
        <dt>Lines</dt><dd>${lines}</dd>
        <dt>Paragraphs</dt><dd>${s.trim()? s.trim().split(/\n{2,}/).length : 0}</dd>
        <dt>Bytes (UTF-8)</dt><dd>${bytes}</dd>
        <dt>Reading time</dt><dd>${readStr}</dd>
      `;
    }
    inp.addEventListener("input", debounce(run, 100));
    run();
  }
});

/* ============== Text diff ============== */
registerTool("text-diff", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2">
        <div class="stack"><label class="field-label">Original</label><textarea class="textarea" id="td-a">Line one
Line two
Line three
Line four</textarea></div>
        <div class="stack"><label class="field-label">Changed</label><textarea class="textarea" id="td-b">Line one
Line TWO!
Line three
Line four
Line five</textarea></div>
      </div>
      <label class="field-label" style="margin-top:var(--sp-4);">Diff</label>
      <div class="output-box scroll" id="td-out"></div>`;
    const a = el.querySelector("#td-a");
    const b = el.querySelector("#td-b");
    const out = el.querySelector("#td-out");
    function run() {
      const A = a.value.split(/\r?\n/);
      const B = b.value.split(/\r?\n/);
      // LCS dynamic
      const n = A.length, m = B.length;
      const dp = Array.from({length:n+1}, () => new Array(m+1).fill(0));
      for (let i = n-1; i >= 0; i--) for (let j = m-1; j >= 0; j--)
        dp[i][j] = A[i] === B[j] ? dp[i+1][j+1]+1 : Math.max(dp[i+1][j], dp[i][j+1]);
      let i = 0, j = 0; const res = [];
      while (i < n && j < m) {
        if (A[i] === B[j]) { res.push([" ", A[i]]); i++; j++; }
        else if (dp[i+1][j] >= dp[i][j+1]) { res.push(["-", A[i]]); i++; }
        else { res.push(["+", B[j]]); j++; }
      }
      while (i < n) { res.push(["-", A[i++]]); }
      while (j < m) { res.push(["+", B[j++]]); }
      out.innerHTML = res.map(([op, line]) => {
        if (op === " ") return `<div style="color:var(--muted-2);padding:1px 0;"><span style="opacity:.5;">  </span>${escapeHtml(line)||" "}</div>`;
        if (op === "-") return `<div style="background:var(--diff-del-bg);color:var(--diff-del-fg);"><strong>−</strong> ${escapeHtml(line)||" "}</div>`;
        return `<div style="background:var(--diff-add-bg);color:var(--diff-add-fg);"><strong>+</strong> ${escapeHtml(line)||" "}</div>`;
      }).join("");
    }
    a.addEventListener("input", debounce(run, 100));
    b.addEventListener("input", debounce(run, 100));
    run();
  }
});

/* ============== String obfuscator ============== */
registerTool("string-obfuscator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">Input</label>
        <input class="input" id="ob-in" value="4111-1111-1111-1111">
        <div class="row">
          <div style="flex:1;"><label class="field-label">Keep first</label><input class="input" id="ob-keep" type="number" value="4" min="0"></div>
          <div style="flex:1;"><label class="field-label">Keep last</label><input class="input" id="ob-keep-last" type="number" value="4" min="0"></div>
          <div style="flex:1;"><label class="field-label">Mask char</label><input class="input" id="ob-char" value="*" maxlength="1" style="max-width:60px;"></div>
        </div>
        <div class="row" style="justify-content:space-between;"><label class="field-label" style="margin:0;">Obfuscated</label><div id="ob-copy"></div></div>
        <div class="output-box" id="ob-out" style="font-size:var(--fs-md);"></div>
      </div>`;
    const inp = el.querySelector("#ob-in");
    const keep = el.querySelector("#ob-keep");
    const keepLast = el.querySelector("#ob-keep-last");
    const ch = el.querySelector("#ob-char");
    function run() {
      const v = inp.value;
      const k = +keep.value, kl = +keepLast.value;
      const len = v.length;
      if (k + kl >= len) { el.querySelector("#ob-out").textContent = v; current = v; return; }
      let out = v.slice(0, k);
      for (let i = 0; i < len - k - kl; i++) out += ch.value || "*";
      out += v.slice(len - kl);
      el.querySelector("#ob-out").textContent = out;
      current = out;
    }
    let current;
    [inp, keep, keepLast, ch].forEach(e => e.addEventListener("input", run));
    el.querySelector("#ob-copy").append(makeCopyButton(() => current));
    run();
  }
});

/* ============== List converter ============== */
registerTool("list-converter", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2">
        <div class="stack">
          <label class="field-label">Input list</label>
          <textarea class="textarea" id="lc-in">apple
banana
cherry</textarea>
          <div class="grid-2">
            <div><label class="field-label">Prefix</label><input class="input" id="lc-pre" value=""></div>
            <div><label class="field-label">Suffix</label><input class="input" id="lc-suf" value=""></div>
            <div><label class="field-label">Separator</label><input class="input" id="lc-sep" value="\\n" style="font-family:var(--font-mono);"></div>
            <div><label class="field-label">Case</label><select class="select" id="lc-case">
              <option value="none">keep</option><option value="lower">lower</option><option value="upper">UPPER</option><option value="title">Title</option>
            </select></div>
          </div>
          <div class="row" style="gap:var(--sp-4);">
            <label class="row" style="gap:6px;font-size:var(--fs-sm);"><input type="checkbox" id="lc-trim"> Trim</label>
            <label class="row" style="gap:6px;font-size:var(--fs-sm);"><input type="checkbox" id="lc-sort"> Sort</label>
            <label class="row" style="gap:6px;font-size:var(--fs-sm);"><input type="checkbox" id="lc-dedupe"> Dedupe</label>
            <label class="row" style="gap:6px;font-size:var(--fs-sm);"><input type="checkbox" id="lc-reverse"> Reverse</label>
          </div>
        </div>
        <div class="stack">
          <div class="row" style="justify-content:space-between;"><label class="field-label" style="margin:0;">Output</label><div id="lc-copy"></div></div>
          <textarea class="textarea" id="lc-out" readonly></textarea>
          <div class="muted-line" id="lc-stats"></div>
        </div>
      </div>`;
    const inp = el.querySelector("#lc-in");
    function sep() { const v = el.querySelector("#lc-sep").value; return v === "\\n" ? "\n" : v === "\\t" ? "\t" : v; }
    function run() {
      let items = inp.value.split("\n");
      if (el.querySelector("#lc-trim").checked) items = items.map(s => s.trim());
      if (el.querySelector("#lc-dedupe").checked) items = [...new Set(items)];
      if (el.querySelector("#lc-sort").checked) items = [...items].sort();
      if (el.querySelector("#lc-reverse").checked) items = items.reverse();
      const cs = el.querySelector("#lc-case").value;
      const pre = el.querySelector("#lc-pre").value, suf = el.querySelector("#lc-suf").value;
      items = items.filter(s => s !== "").map(s => {
        if (cs === "lower") s = s.toLowerCase();
        else if (cs === "upper") s = s.toUpperCase();
        else if (cs === "title") s = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        return pre + s + suf;
      });
      el.querySelector("#lc-out").value = items.join(sep());
      el.querySelector("#lc-stats").textContent = `${items.length} items`;
    }
    el.querySelectorAll("input, select, textarea").forEach(e => e.addEventListener("input", debounce(run, 80)));
    el.querySelector("#lc-copy").append(makeCopyButton(() => el.querySelector("#lc-out").value));
    run();
  }
});

/* ============== Numeronym generator ============== */
registerTool("numeronym-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">Word</label>
        <input class="input" id="ny-in" value="internationalization">
        <div class="output-box" id="ny-out" style="font-size:var(--fs-xl);color:var(--accent-text);text-align:center;font-weight:700;">—</div>
      </div>`;
    const inp = el.querySelector("#ny-in");
    inp.addEventListener("input", () => {
      const w = inp.value.trim();
      const out = el.querySelector("#ny-out");
      if (w.length < 4) { out.textContent = w || "—"; return; }
      out.textContent = w[0] + (w.length - 2) + w[w.length-1];
    });
    inp.dispatchEvent(new Event("input"));
  }
});

/* ============== Phone parser ============== */
registerTool("phone-parser-and-formatter", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <div class="row">
          <label class="field-label" style="margin:0;">Default region</label>
          <select class="select" id="ph-region" style="max-width:120px;">
            ${["US","GB","FR","DE","CN","JP","IN","BR","AU","CA"].map(c=>`<option value="${c}">${c}</option>`).join("")}
          </select>
        </div>
        <label class="field-label">Phone number</label>
        <input class="input" id="ph-in" value="+1 (415) 555-2671;ext=42">
        <dl class="kv" id="ph-out"></dl>
      </div>`;
    const inp = el.querySelector("#ph-in");
    const region = el.querySelector("#ph-region");
    function run() {
      const out = el.querySelector("#ph-out");
      try {
        const lib = window.libphonenumber;
        const parse = lib.parsePhoneNumberFromString || lib.parsePhoneNumber;
        const pn = parse(inp.value, region.value);
        if (!pn) throw new Error();
        const type = (() => { try { return pn.getType() || "unknown"; } catch { return "unknown"; } })();
        out.innerHTML = `
          <dt>Valid</dt><dd><span class="tag tag-add">${pn.isValid() ? "yes" : "no"}</span></dd>
          <dt>Possible</dt><dd>${pn.isPossible() ? "yes" : "no"}</dd>
          <dt>Country</dt><dd>${pn.country || "—"}</dd>
          <dt>National number</dt><dd>${pn.nationalNumber}</dd>
          <dt>Country code</dt><dd>+${pn.countryCallingCode}</dd>
          <dt>International</dt><dd>${pn.formatInternational()}</dd>
          <dt>National</dt><dd>${pn.formatNational()}</dd>
          <dt>RFC3966</dt><dd>${pn.format("RFC3966")}</dd>
          <dt>URI</dt><dd>${pn.getURI()}</dd>
          <dt>Type</dt><dd>${type}</dd>
        `;
      } catch { out.innerHTML = `<dt>Error</dt><dd style="color:var(--rose);">Could not parse.</dd>`; }
    }
    inp.addEventListener("input", debounce(run, 100));
    region.addEventListener("change", run);
    run();
  }
});

/* ============== IBAN validator ============== */
registerTool("iban-validator-and-parser", {
  mount(el) {
    const countryNames = { DE:"Germany", FR:"France", GB:"United Kingdom", IT:"Italy", ES:"Spain", NL:"Netherlands", BE:"Belgium", AT:"Austria", PT:"Portugal", IE:"Ireland", FI:"Finland", CH:"Switzerland", US:"United States (no IBAN)", CN:"China (no IBAN)" };
    el.innerHTML = `
      <div class="stack">
        <label class="field-label">IBAN</label>
        <input class="input" id="ib-in" value="FR14 2004 1010 0505 0001 3M02 606" style="font-family:var(--font-mono);">
        <dl class="kv" id="ib-out"></dl>
      </div>`;
    const inp = el.querySelector("#ib-in");
    function mod97(numStr) {
      let rem = 0;
      for (let i = 0; i < numStr.length; i++) rem = (rem * 10 + +numStr[i]) % 97;
      return rem;
    }
    function run() {
      const out = el.querySelector("#ib-out");
      const raw = inp.value.replace(/\s+/g,"").toUpperCase();
      const m = raw.match(/^([A-Z]{2})(\d{2})([A-Z0-9]{1,30})$/);
      if (!m) { out.innerHTML = `<dt>Format</dt><dd style="color:var(--rose);">Not a valid IBAN structure.</dd>`; return; }
      const country = m[1], check = m[2], bban = m[3];
      // rearrange: country+check moves to end, letters → numbers
      const rearranged = bban + country + check;
      const numeric = rearranged.replace(/[A-Z]/g, c => (c.charCodeAt(0) - 55).toString());
      const valid = mod97(numeric) === 1;
      const lengths = { DE:22, FR:27, GB:22, IT:27, ES:24, NL:18, BE:16, AT:20, PT:25, IE:22, FI:18, CH:21 };
      const lenOK = lengths[country] ? raw.length === lengths[country] : true;
      out.innerHTML = `
        <dt>Valid checksum</dt><dd>${valid ? `<span class="tag tag-add">${icons.check} valid</span>` : `<span class="tag tag-del">invalid checksum</span>`}</dd>
        <dt>Country</dt><dd>${country} — ${countryNames[country] || "—"}</dd>
        <dt>Check digits</dt><dd>${check}</dd>
        <dt>BBAN</dt><dd>${bban}</dd>
        <dt>Length</dt><dd>${raw.length} ${lengths[country] ? `(expected ${lengths[country]})` : ""}</dd>
        <dt>Formatted</dt><dd>${raw.match(/.{1,4}/g).join(" ")}</dd>
      `;
    }
    inp.addEventListener("input", debounce(run, 100));
    run();
  }
});
