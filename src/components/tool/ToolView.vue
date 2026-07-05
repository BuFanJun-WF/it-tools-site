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

// 记录最近访问的工具：仅当已实现且确实在 toolRegistry 注册时才入库，
// 避免 catalog 与 registry 漂移时把死链 id 写进「最近使用」。
watch(
  () => tool.value?.id,
  id => {
    if (id && tool.value?.implemented && toolRegistry[id]) recent.push(id)
  },
  { immediate: true },
)

// 在组件实例作用域缓存异步组件包装；加载失败时清掉缓存、允许切回复重试，
// 避免因网络抖动或部署 chunk 变更导致永久渲染失败态、只能刷新整页。
const asyncToolCache: Record<string, Component> = {}
const AsyncTool = computed<Component | null>(() => {
  if (!tool.value || !tool.value.implemented) return null
  const id = tool.value.id
  if (!asyncToolCache[id] && toolRegistry[id]) {
    asyncToolCache[id] = defineAsyncComponent({
      loader: toolRegistry[id],
      onError: () => { delete asyncToolCache[id] },
    })
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
