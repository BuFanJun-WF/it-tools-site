/* =========================================================================
   Text tools — emoji picker
   ========================================================================= */
import { icons } from "../icons.js";
import { registerTool } from "../views/tool.js";
import { makeCopyButton, debounce, escapeHtml } from "../utils.js";

const emojiSet = [
  ["Smileys", "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😬 😴 🤤 😪"].join(" "),
  ["Gestures", "👍 👎 👊 ✊ 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 👉 👈 👆 👇 ☝️ ✋ 🤚 🖐️ 🖖 👋 🤙"].join(" "),
  ["Love", "❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 ♥️ 💋"].join(" "),
  ["Animals", "🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🐤 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷️ 🐢 🐍 🦎 🦖 🐙 🦑 🦐 🦞 🦀 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🌸 🌺 🌻 🌹 🌷 🌼"].join(" "),
  ["Food", "🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 🥕 🌽 🌶️ 🥔 🍠 🥐 🍞 🥖 🥨 🧀 🥚 🍳 🥞 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🍣 🍜 🍝 🍛 🍚 🍘 🍙 🍚 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪"].join(" "),
  ["Activities", "⚽ 🏀 🏈 ⚾ 🥎 🎾 🏐 🏉 🥏 🎱 🪀 🏓 🏸 🏒 🏑 🥍 🏏 🥅 ⛳ 🪁 🏹 🎣 🤿 🥊 🥋 🎽 🛹 🛼 ⛸️ 🥌 🎿 ⛷️ 🏂 🪂 🏋️ 🤼 🤸 ⛹️ 🤺 🤾 🏌️ 🏄 🏊 🤽 🚣 🧗 🚵 🚴 🏆 🥇 🥈 🥉 🏅 🎖️ 🎗️ 🎫 🎬 🎤 🎧 🎼 🎹 🥁 🎷 🎺 🎸 🎻 🎲 🎯 🎳 🎮 🎰 🧩"].join(" "),
  ["Travel", "🚗 🚕 🚙 🚌 🏎️ 🚓 🚑 🚒 🚐 🚚 🚛 🚜 🛵 🏍️ 🚲 🛴 ✈️ 🚀 🛸 🚁 ⛵ 🚤 🛳️ ⛴️ 🚢 🚂 🚆 🚊 🚉 🗼 🗽 🗿 🏰 🏯 🏟️ 🎡 🎢 🎠 ⛲ ⛱️ 🏖️ 🏝️ 🏜️ 🌋 ⛰️ 🏔️ 🗻 🏕️ ⛺ 🌄 🌅 🌠"].join(" "),
  ["Objects", "⌚ 📱 💻 ⌨️ 🖥️ 🖨️ 🖱️ 🕹️ 💾 💿 📷 📸 🎥 📹 🎞️ 💡 🔦 🕯️ 💸 💵 💴 💶 💷 🪙 💰 💳 💎 🔧 🔨 🛠️ ⚙️ ⛓️ 🧰 🔬 🔭 📡 🧪 🧫 🧬 🩺 💊 💉 🩸 🧹 🧺 🧻 🚽 🚰 🚿 🛁 🛎️ 🔑 🗝️ 🚪 🪑 🛋️ 🛏️"].join(" "),
  ["Symbols", "✅ ❌ ❓ ❗ ⭕ 🚫 💯 🔥 ⭐ 🌟 ✨ ⚡ 💥 🎉 🎊 🎈 🎁 🏷️ 🔒 🔓 🔐 🔑 📍 📌 🧷 🔗 📎"].join(" "),
  ["Flags", "🏳️ 🏴 🏁 🚩 🇺🇸 🇬🇧 🇪🇺 🇫🇷 🇩🇪 🇮🇹 🇪🇸 🇳🇱 🇧🇪 🇨🇦 🇧🇷 🇦🇺 🇯🇵 🇨🇳 🇰🇷 🇮🇳 🇲🇽 🇷🇺 🇿🇦"].join(" "),
];

registerTool("emoji-picker", {
  mount(el) {
    el.innerHTML = `
      <div class="stack">
        <input class="input" id="em-search" placeholder="Search emoji by name…" style="margin-bottom:var(--sp-3);">
        <div id="em-tabs" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:var(--sp-4);"></div>
        <div id="em-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(48px,1fr));gap:4px;max-height:480px;overflow:auto;"></div>
        <div id="em-detail" class="output-box" style="margin-top:var(--sp-4);">Click an emoji to see its details.</div>
      </div>`;
    const search = el.querySelector("#em-search");
    const tabs = el.querySelector("#em-tabs");
    const grid = el.querySelector("#em-grid");
    const detail = el.querySelector("#em-detail");
    let active = emojiSet[0][0];
    function renderTabs() {
      tabs.innerHTML = emojiSet.map(([name]) =>
        `<button class="btn btn-sm ${active===name?'btn-primary':'btn-ghost'}" data-cat="${name}">${name}</button>`).join("");
      tabs.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { active = b.dataset.cat; search.value=""; render(); }));
    }
    function render() {
      const q = search.value.trim().toLowerCase();
      let list;
      if (q) {
        list = [...new Set(emojiSet.flatMap(([_,emojis]) => emojis.split(/\s+/)).filter(Boolean))];
        // crude: filter by codepoint hex containing q
        list = list.filter(e => e.codePointAt(0).toString(16).includes(q));
      } else {
        const cat = emojiSet.find(([n]) => n === active);
        list = cat ? cat[1].split(/\s+/).filter(Boolean) : [];
      }
      grid.innerHTML = "";
      list.forEach(e => {
        const btn = document.createElement("button");
        btn.textContent = e;
        btn.style.cssText = "font-size:24px;background:var(--surface-2);border:1px solid var(--border-soft);border-radius:var(--r-md);height:46px;cursor:pointer;transition:background .1s;";
        btn.addEventListener("mouseenter", () => btn.style.background = "var(--surface-3)");
        btn.addEventListener("mouseleave", () => btn.style.background = "var(--surface-2)");
        btn.addEventListener("click", () => {
          const cp = e.codePointAt(0);
          const hex = cp.toString(16).toUpperCase();
          detail.innerHTML = `<div class="row" style="justify-content:space-between;align-items:center;">
            <div style="font-size:40px;">${e}</div>
            <div style="text-align:right;">
              <div class="muted-line">U+${hex}</div>
              <div class="muted-line">${cp} decimal</div>
            </div>
          </div>`;
          // append copy button to detail
          const cp2 = document.createElement("div"); cp2.style.marginTop = "var(--sp-3)";
          cp2.append(makeCopyButton(() => e, "Copy emoji"), makeCopyButton(() => "U+"+hex, "Copy codepoint"));
          detail.append(cp2);
        });
        grid.append(btn);
      });
      if (!list.length) grid.innerHTML = `<div class="muted-line" style="grid-column:1/-1;padding:var(--sp-4);">No matches.</div>`;
    }
    search.addEventListener("input", debounce(render, 120));
    renderTabs();
    render();
  }
});
