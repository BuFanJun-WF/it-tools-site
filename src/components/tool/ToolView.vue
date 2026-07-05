<script setup lang="ts">
import { computed, defineAsyncComponent, watch, type Component } from 'vue'
import { useRoute } from 'vue-router'
import { findTool } from '@/data/catalog'
import { toolRegistry } from '@/tools'
import { useRecentStore } from '@/stores/recent'
import ToolHeader from './ToolHeader.vue'
import ComingSoon from './ComingSoon.vue'
import NotFound from '@/components/NotFound.vue'

const route = useRoute()
const recent = useRecentStore()

const tool = computed(() => findTool(route.params.toolId as string))

// Track recently-visited tools (implemented only) for the home "recently used" row.
watch(
  () => tool.value?.id,
  id => {
    if (id && tool.value?.implemented) recent.push(id)
  },
  { immediate: true },
)

// Cache async tool wrappers at module scope so re-visiting a tool reuses its
// previous load state instead of re-running the loader on every route change.
const asyncToolCache: Record<string, Component> = {}
const AsyncTool = computed<Component | null>(() => {
  if (!tool.value || !tool.value.implemented) return null
  const id = tool.value.id
  if (!asyncToolCache[id] && toolRegistry[id]) {
    asyncToolCache[id] = defineAsyncComponent(toolRegistry[id])
  }
  return asyncToolCache[id] ?? null
})
</script>

<template>
  <div v-if="tool" class="page page-enter">
    <ToolHeader :tool="tool" />

    <component :is="AsyncTool" v-if="AsyncTool" :tool="tool" />

    <ComingSoon v-else :tool="tool" />
  </div>

  <NotFound v-else />
</template>
