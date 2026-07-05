<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import { findTool } from '@/data/catalog'
import { toolRegistry } from '@/tools'
import ToolHeader from './ToolHeader.vue'
import ComingSoon from './ComingSoon.vue'
import NotFound from '@/components/NotFound.vue'

const route = useRoute()

const tool = computed(() => findTool(route.params.toolId as string))

const AsyncTool = computed(() => {
  if (!tool.value || !tool.value.implemented) return null
  const loader = toolRegistry[tool.value.id]
  return loader ? defineAsyncComponent(loader) : null
})
</script>

<template>
  <div v-if="tool">
    <ToolHeader :tool="tool" />

    <component :is="AsyncTool" v-if="AsyncTool" :tool="tool" />

    <ComingSoon v-else :tool="tool" />
  </div>

  <NotFound v-else />
</template>
