/* =========================================================================
   Images & videos tools
   ========================================================================= */
import { icons } from "../icons.js";
import { registerTool } from "../views/tool.js";
import { makeCopyButton, download, debounce } from "../utils.js";

/* ============== QR code generator ============== */
registerTool("qrcode-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2 uneven">
        <div class="stack">
          <label class="field-label">Text / URL</label>
          <textarea class="textarea" id="qr-text" style="min-height:90px;">https://example.com</textarea>
          <div class="grid-2">
            <div>
              <label class="field-label">Foreground</label>
              <input type="color" id="qr-fg" value="#100f0d" class="input" style="height:40px;padding:4px;">
            </div>
            <div>
              <label class="field-label">Background</label>
              <input type="color" id="qr-bg" value="#ffffff" class="input" style="height:40px;padding:4px;">
            </div>
          </div>
          <div class="row">
            <label class="field-label" style="margin:0;">Size</label>
            <input type="range" id="qr-size" min="160" max="640" value="320" step="40">
            <span id="qr-size-v" class="muted-line" style="font-family:var(--font-mono);font-size:var(--fs-xs);">320px</span>
          </div>
          <div class="row">
            <label class="field-label" style="margin:0;">Error correction</label>
            <select class="select" id="qr-ec" style="max-width:120px;">
              <option value="L">L · 7%</option>
              <option value="M" selected>M · 15%</option>
              <option value="Q">Q · 25%</option>
              <option value="H">H · 30%</option>
            </select>
          </div>
        </div>
        <div class="stack" style="align-items:center;justify-content:center;">
          <div id="qr-canvas" style="background:#fff;padding:16px;border-radius:var(--r-md);">
            <canvas id="qr-cv"></canvas>
          </div>
          <button class="btn btn-sm" id="qr-download">${icons.download} Download PNG</button>
        </div>
      </div>`;
    const txt = el.querySelector("#qr-text");
    const fg = el.querySelector("#qr-fg");
    const bg = el.querySelector("#qr-bg");
    const size = el.querySelector("#qr-size");
    const sizeV = el.querySelector("#qr-size-v");
    const ec = el.querySelector("#qr-ec");
    const canvas = el.querySelector("#qr-cv");
    let qr = null;

    function run() {
      sizeV.textContent = size.value + "px";
      if (!txt.value.trim()) { canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height); return; }
      try {
        const opts = {
          element: canvas,
          value: txt.value,
          size: +size.value,
          background: bg.value,
          foreground: fg.value,
          level: ec.value,
          padding: 8,
        };
        qr = new QRious(opts);
      } catch (e) {
        el.querySelector("#qr-canvas").innerHTML = `<span style="color:var(--rose);">${e.message}</span>`;
      }
    }
    [txt, fg, bg, ec].forEach(e => e.addEventListener("input", debounce(run, 120)));
    size.addEventListener("input", run);
    el.querySelector("#qr-download").addEventListener("click", () => {
      if (canvas.toDataURL) {
        const url = canvas.toDataURL("image/png");
        download("qrcode.png", dataURLtoBlob(url));
      }
    });
    run();
  }
});

function dataURLtoBlob(url) {
  const arr = url.split(","); const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]); let n = bstr.length; const u8 = new Uint8Array(n);
  while (n--) u8[n] = bstr.charCodeAt(n);
  return new Blob([u8], { type: mime });
}

/* ============== WiFi QR code ============== */
registerTool("wifi-qrcode-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2 uneven">
        <div class="stack">
          <div>
            <label class="field-label">SSID (network name)</label>
            <input class="input" id="wf-ssid" value="MyNetwork">
          </div>
          <div>
            <label class="field-label">Password</label>
            <input class="input" id="wf-pass" value="supersecret">
          </div>
          <div>
            <label class="field-label">Encryption</label>
            <select class="select" id="wf-enc">
              <option value="WPA" selected>WPA / WPA2 / WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
          <label class="row" style="gap:6px;font-size:var(--fs-sm);color:var(--muted);">
            <input type="checkbox" id="wf-hidden"> Hidden network
          </label>
        </div>
        <div class="stack" style="align-items:center;justify-content:center;">
          <div id="wf-canvas" style="background:#fff;padding:16px;border-radius:var(--r-md);">
            <canvas id="wf-cv"></canvas>
          </div>
          <button class="btn btn-sm" id="wf-download">${icons.download} Download PNG</button>
        </div>
      </div>`;
    const ssid = el.querySelector("#wf-ssid");
    const pass = el.querySelector("#wf-pass");
    const enc = el.querySelector("#wf-enc");
    const hidden = el.querySelector("#wf-hidden");
    const slot = el.querySelector("#wf-canvas");
    let currentUrl = "";
    function escapeWifi(v) { return v.replace(/([\\;,:"])/g, "\\$1"); }
    function run() {
      const T = enc.value === "nopass" ? `WIFI:T:nopass;S:${escapeWifi(ssid.value)};${hidden.checked ? "H:true;" : ""};` : `WIFI:T:${enc.value};S:${escapeWifi(ssid.value)};P:${escapeWifi(pass.value)};${hidden.checked ? "H:true;" : ""};`;
      try {
        new QRious({ element: el.querySelector("#wf-cv"), value: T, size: 280, background: "#ffffff", foreground: "#100f0d", padding: 8, level: "M" });
      } catch (e) { slot.innerHTML = `<span style="color:var(--rose);">${e.message}</span>`; }
    }
    [ssid, pass, enc, hidden].forEach(e => e.addEventListener("input", debounce(run, 120)));
    el.querySelector("#wf-download").addEventListener("click", () => {
      const cv = el.querySelector("#wf-cv");
      if (cv && cv.toDataURL) download("wifi.png", dataURLtoBlob(cv.toDataURL("image/png")));
    });
    run();
  }
});

/* ============== SVG placeholder generator ============== */
registerTool("svg-placeholder-generator", {
  mount(el) {
    el.innerHTML = `
      <div class="grid-2 uneven">
        <div class="stack">
          <div class="row">
            <div style="flex:1;"><label class="field-label">Width</label><input class="input" id="sv-w" type="number" value="640"></div>
            <div style="flex:1;"><label class="field-label">Height</label><input class="input" id="sv-h" type="number" value="360"></div>
          </div>
          <div class="row">
            <div style="flex:1;"><label class="field-label">Background</label><input type="color" id="sv-bg" value="#2a2622" class="input" style="height:40px;padding:4px;"></div>
            <div style="flex:1;"><label class="field-label">Text color</label><input type="color" id="sv-fg" value="#a39b8f" class="input" style="height:40px;padding:4px;"></div>
          </div>
          <div>
            <label class="field-label">Label</label>
            <input class="input" id="sv-label" value="640 × 360">
          </div>
        </div>
        <div class="stack" style="align-items:center;justify-content:center;">
          <div id="sv-prev"></div>
          <button class="btn btn-sm" id="sv-download">${icons.download} Download SVG</button>
        </div>
      </div>
      <label class="field-label" style="margin-top:var(--sp-4);">SVG source</label>
      <textarea class="textarea" id="sv-src" readonly></textarea>`;
    const w = el.querySelector("#sv-w");
    const h = el.querySelector("#sv-h");
    const bg = el.querySelector("#sv-bg");
    const fg = el.querySelector("#sv-fg");
    const lab = el.querySelector("#sv-label");
    const prev = el.querySelector("#sv-prev");
    const src = el.querySelector("#sv-src");
    let svgText = "";
    function run() {
      const W = +w.value, H = +h.value;
      const text = lab.value || `${W} × ${H}`;
      const fs = Math.round(Math.min(W, H) / 8);
      svgText = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg.value}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="${fs}" fill="${fg.value}">${escapeEntities(text)}</text>
</svg>`;
      prev.innerHTML = svgText;
      src.value = svgText;
    }
    function escapeEntities(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
    [w, h, bg, fg, lab].forEach(e => e.addEventListener("input", debounce(run, 100)));
    el.querySelector("#sv-download").addEventListener("click", () => download("placeholder.svg", svgText, "image/svg+xml"));
    run();
  }
});
