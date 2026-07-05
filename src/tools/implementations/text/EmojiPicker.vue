<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TextInput from '@/components/ui/TextInput.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Stack from '@/components/ui/Stack.vue'

const { t } = useI18n()

const emojiSet: [string, string][] = [
  ['Smileys', '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🤗 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😴 🤤 😪'],
  ['Gestures', '👍 👎 👊 ✊ 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 👉 👈 👆 👇 ☝️ ✋ 🤚 🖐️ 🖖 👋 🤙'],
  ['Love', '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💓 💗 💖 💘 💝 💟 ♥️ 💋'],
  ['Animals', '🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🐤 🦆 🦅 🦉 🦇 🐺 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🦗 🕷️ 🐢 🐍 🦎 🦖 🐙 🦑 🦐 🦞 🦀 🐠 🐟 🐬 🐳 🐋 🦈 🐊 🌸 🌺 🌻 🌹 🌷 🌼'],
  ['Food', '🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍈 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🍆 🥑 🥦 🥕 🌽 🌶️ 🥔 🍠 🥐 🍞 🥖 🥨 🧀 🥚 🍳 🥞 🥓 🍔 🍟 🍕 🌭 🥪 🌮 🌯 🍣 🍜 🍝 🍛 🍚 🍘 🍙 🍰 🎂 🍮 🍭 🍬 🍫 🍿 🍩 🍪'],
  ['Activities', '⚽ 🏀 🏈 ⚾ 🥎 🎾 🏐 🏉 🥏 🎱 🪀 🏓 🏸 🏒 🏑 🥍 🏏 🥅 ⛳ 🪁 🏹 🎣 🤿 🥊 🥋 🎽 🛹 🛼 ⛸️ 🥌 🎿 ⛷️ 🏂 🪂 🏋️ 🤼 🤸 ⛹️ 🤺 🤾 🏌️ 🏄 🏊 🤽 🚣 🧗 🚵 🚴 🏆 🥇 🥈 🥉 🏅 🎖️ 🎗️ 🎫 🎬 🎤 🎧 🎼 🎹 🥁 🎷 🎺 🎸 🎻 🎲 🎯 🎳 🎮 🎰 🧩'],
  ['Travel', '🚗 🚕 🚙 🚌 🏎️ 🚓 🚑 🚒 🚐 🚚 🚛 🚜 🛵 🏍️ 🚲 🛴 ✈️ 🚀 🛸 🚁 ⛵ 🚤 🛳️ ⛴️ 🚢 🚂 🚆 🚊 🚉 🗼 🗽 🗿 🏰 🏯 🏟️ 🎡 🎢 🎠 ⛲ ⛱️ 🏖️ 🏝️ 🏜️ 🌋 ⛰️ 🏔️ 🗻 🏕️ ⛺ 🌄 🌅 🌠'],
  ['Objects', '⌚ 📱 💻 ⌨️ 🖥️ 🖨️ 🖱️ 🕹️ 💾 💿 📷 📸 🎥 📹 🎞️ 💡 🔦 🕯️ 💸 💵 💴 💶 💷 🪙 💰 💳 💎 🔧 🔨 🛠️ ⚙️ ⛓️ 🧰 🔬 🔭 📡 🧪 🧫 🧬 🩺 💊 💉 🩸 🧹 🧺 🧻 🚽 🚰 🚿 🛁 🛎️ 🔑 🗝️ 🚪 🪑 🛋️ 🛏️'],
  ['Symbols', '✅ ❌ ❓ ❗ ⭕ 🚫 💯 🔥 ⭐ 🌟 ✨ ⚡ 💥 🎉 🎊 🎈 🎁 🏷️ 🔒 🔓 🔐 🔑 📍 📌 🧷 🔗 📎'],
  ['Flags', '🏳️ 🏴 🏁 🚩 🇺🇸 🇬🇧 🇪🇺 🇫🇷 🇩🇪 🇮🇹 🇪🇸 🇳🇱 🇧🇪 🇨🇦 🇧🇷 🇦🇺 🇯🇵 🇨🇳 🇰🇷 🇮🇳 🇲🇽 🇷🇺 🇿🇦'],
]

const active = ref(emojiSet[0][0])
const search = ref('')
const selected = ref<{ emoji: string; hex: string; decimal: number } | null>(null)

// Flattened, de-duplicated emoji list for search — locale-independent, build once.
const ALL_EMOJIS = [...new Set(emojiSet.flatMap(([, e]) => e.split(/\s+/)).filter(Boolean))]

const list = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (q) {
    return ALL_EMOJIS.filter(e => e.codePointAt(0)!.toString(16).includes(q) || e.includes(q))
  }
  const cat = emojiSet.find(([n]) => n === active.value)
  return cat ? cat[1].split(/\s+/).filter(Boolean) : []
})

const tabs = emojiSet.map(([n]) => n)

function pick(e: string) {
  const cp = e.codePointAt(0)!
  selected.value = { emoji: e, hex: cp.toString(16).toUpperCase(), decimal: cp }
}
</script>

<template>
  <Stack class="tool-body">
    <TextInput v-model="search" :placeholder="t('impl.emoji-picker.search')" />

    <div v-if="!search" class="tabs">
      <button v-for="tb in tabs" :key="tb" :class="['tab', active === tb && 'active']" @click="active = tb">{{ tb }}</button>
    </div>

    <div class="grid">
      <button v-for="e in list" :key="e" class="cell" @click="pick(e)">{{ e }}</button>
      <p v-if="!list.length" class="muted-line" style="grid-column: 1 / -1; padding: var(--sp-4);">{{ t('impl.emoji-picker.noMatch') }}</p>
    </div>

    <OutputBox v-if="selected" :empty="false">
      <div class="detail">
        <div class="big">{{ selected.emoji }}</div>
        <div class="meta">
          <div class="muted-line">U+{{ selected.hex }}</div>
          <div class="muted-line">{{ selected.decimal }} {{ t('impl.emoji-picker.decimal') }}</div>
        </div>
        <div class="actions">
          <CopyButton :text="() => selected!.emoji" :label="t('impl.emoji-picker.copyEmoji')" />
          <CopyButton :text="() => 'U+' + selected!.hex" :label="t('impl.emoji-picker.copyCode')" />
        </div>
      </div>
    </OutputBox>
    <OutputBox v-else empty>{{ t('impl.emoji-picker.clickHint') }}</OutputBox>
  </Stack>
</template>

<style scoped>
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tab {
  height: 30px;
  padding: 0 var(--sp-3);
  border-radius: var(--r-pill);
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--muted);
  font-size: var(--fs-xs);
  font-weight: 600;
  transition: all var(--dur-fast) var(--ease);
}
.tab:hover { color: var(--text); }
.tab.active { background: var(--accent); border-color: transparent; color: #fff; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 4px;
  max-height: 420px;
  overflow: auto;
}
.cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 46px;
  border-radius: var(--r-md);
  border: 1px solid var(--border-soft);
  background: var(--surface-2);
  font-size: 24px;
  transition: background var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);
}
.cell:hover { background: var(--surface-3); transform: scale(1.08); }

.detail {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
}
.detail .big { font-size: 40px; line-height: 1; }
.detail .meta { flex: 1; }
.detail .actions { display: flex; gap: 6px; }
.muted-line { color: var(--muted); font-size: var(--fs-sm); }
</style>
