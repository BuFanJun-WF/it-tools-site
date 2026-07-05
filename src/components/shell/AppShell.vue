<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

const onKey = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    const el = document.getElementById('global-search') as HTMLInputElement | null
    el?.focus()
    el?.select()
  }
}
onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="app">
    <Sidebar />
    <div :class="['scrim', ui.mobileNavOpen && 'show']" @click="ui.closeMobileNav()" />
    <div class="main">
      <Topbar />
      <main class="content">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  min-height: 100vh;
}
.main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.content {
  flex: 1;
  width: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: var(--sp-8) var(--sp-8) var(--sp-16);
}
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  opacity: 0;
  pointer-events: none;
  z-index: 40;
  transition: opacity var(--dur) var(--ease);
}

@media (max-width: 920px) {
  .app { grid-template-columns: 1fr; }
  .content { padding: var(--sp-6) var(--sp-5) var(--sp-16); }
  .scrim.show { opacity: 1; pointer-events: auto; }
}
</style>
