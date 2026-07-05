<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
</script>

<template>
  <div class="empty-state">
    <AppIcon name="search" :size="48" />
    <h3>{{ t('notFound.title') }}</h3>
    <p>{{ t('notFound.body') }}</p>
    <RouterLink to="/">
      <BaseButton variant="primary">{{ t('notFound.back') }}</BaseButton>
    </RouterLink>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--sp-16) var(--sp-6);
  color: var(--muted);
}
.empty-state :deep(svg) { color: var(--faint); margin-bottom: var(--sp-4); }
.empty-state h3 {
  font-size: var(--fs-xl);
  color: var(--text-strong);
  margin-bottom: var(--sp-2);
}
.empty-state p { margin-bottom: var(--sp-5); max-width: 36ch; }
</style>
