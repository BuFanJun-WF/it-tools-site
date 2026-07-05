<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
const route = useRoute()

// Map route name → i18n title/body/icon. These are lightweight landing pages
// (the reference site also routes them as informational); the tool hall and
// tool pages are where the real functionality lives.
const META: Record<string, { icon: string; titleKey: string; bodyKey: string }> = {
  about: {
    icon: 'sparkles',
    titleKey: 'home.about.title',
    bodyKey: 'pages.about.body',
  },
  blog: {
    icon: 'fileText',
    titleKey: 'footer.links.changelog',
    bodyKey: 'pages.blog.body',
  },
  feedback: {
    icon: 'heart',
    titleKey: 'app.nav.items.feedback',
    bodyKey: 'pages.feedback.body',
  },
}

const meta = computed(() => {
  const name = (route.name as string) ?? 'about'
  return META[name] ?? META.about
})
</script>

<template>
  <div class="page page-enter">
    <section class="simple">
      <span class="ic"><AppIcon :name="meta.icon" :size="26" /></span>
      <h1>{{ t(meta.titleKey) }}</h1>
      <p class="sub">{{ t(meta.bodyKey) }}</p>
      <div class="actions">
        <RouterLink to="/hall"><BaseButton variant="primary">{{ t('app.nav.items.hall') }}</BaseButton></RouterLink>
        <RouterLink to="/"><BaseButton variant="ghost">{{ t('app.nav.items.home') }}</BaseButton></RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.simple {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--sp-16) var(--sp-6);
}
.ic {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: var(--r-xl);
  background: var(--accent-soft);
  color: var(--accent-text);
  margin-bottom: var(--sp-5);
}
h1 {
  font-size: var(--fs-2xl);
  font-weight: 700;
  color: var(--text-strong);
  letter-spacing: -0.02em;
  margin-bottom: var(--sp-2);
}
.sub {
  color: var(--muted);
  font-size: var(--fs-md);
  max-width: 48ch;
  margin: 0 0 var(--sp-6);
}
.actions { display: flex; gap: var(--sp-3); flex-wrap: wrap; justify-content: center; }
</style>
