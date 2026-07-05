<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import NoticeBox from '@/components/ui/NoticeBox.vue'
import TagBadge from '@/components/ui/TagBadge.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import type { Tool } from '@/types/tool'

defineProps<{ tool: Tool }>()
const { t } = useI18n()
</script>

<template>
  <div class="tool-body">
    <NoticeBox>
      <template #icon><AppIcon name="alert" :size="18" /></template>
      {{ t('tool.comingSoon.body', { name: t(tool.nameKey) }) }}
    </NoticeBox>

    <div class="tag-row">
      <TagBadge>{{ t('tool.comingSoon.id', { id: tool.id }) }}</TagBadge>
      <TagBadge>{{ t('tool.comingSoon.category', { cat: tool.category }) }}</TagBadge>
      <TagBadge v-for="k in tool.keywords.slice(0, 6)" :key="k">{{ k }}</TagBadge>
    </div>
  </div>
</template>

<style scoped>
.tool-body {
  display: flex;
  flex-direction: column;
  gap: var(--sp-5);
  padding: var(--sp-6);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  background: var(--surface);
}
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}
</style>
