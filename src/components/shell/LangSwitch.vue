<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocaleStore } from '@/stores/locale'
import { onClickOutside } from '@vueuse/core'
import AppIcon from '@/components/ui/AppIcon.vue'

const { locale } = useI18n()
const store = useLocaleStore()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
onClickOutside(root, () => (open.value = false))

function pick(value: 'en' | 'zh-CN') {
  store.set(value)
  open.value = false
}
</script>

<template>
  <div ref="root" class="lang-switch">
    <button
      class="lang-trigger"
      :title="$t('app.actions.language')"
      :aria-label="$t('app.actions.language')"
      @click="open = !open"
    >
      <AppIcon name="globe" :size="16" />
      <span class="lang-code">{{ locale === 'zh-CN' ? '中' : 'EN' }}</span>
    </button>

    <Transition name="slide-fade">
      <div v-if="open" class="lang-menu">
        <button
          v-for="opt in store.options"
          :key="opt.value"
          :class="['lang-option', opt.value === store.current && 'active']"
          @click="pick(opt.value)"
        >
          <span class="short">{{ opt.short }}</span>
          <span class="full">{{ opt.label }}</span>
          <AppIcon v-if="opt.value === store.current" name="check" :size="14" class="tick" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.lang-switch { position: relative; }
.lang-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 10px;
  border-radius: var(--r-md);
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  transition:
    background-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}
.lang-trigger:hover {
  background: var(--surface-2);
  color: var(--text);
}
.lang-code {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.lang-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 160px;
  padding: 5px;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: var(--shadow-pop);
  z-index: 60;
}
.lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  border-radius: var(--r-sm);
  background: transparent;
  color: var(--muted);
  font-size: var(--fs-sm);
  text-align: left;
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.lang-option:hover { background: var(--surface-2); color: var(--text); }
.lang-option.active { color: var(--accent-text); background: var(--accent-soft); }
.lang-option .short {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--r-sm);
  background: var(--surface-3);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
}
.lang-option .full { flex: 1; }
.lang-option .tick { color: var(--accent); }
</style>
