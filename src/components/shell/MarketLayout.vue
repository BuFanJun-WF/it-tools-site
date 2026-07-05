<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import MarketHeader from './MarketHeader.vue'
import SiteFooter from './SiteFooter.vue'

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
  <div class="layout">
    <MarketHeader />
    <main class="content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content {
  flex: 1;
  width: 100%;
}
</style>
