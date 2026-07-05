<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import Row from '@/components/ui/Row.vue'
import Stack from '@/components/ui/Stack.vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const { t } = useI18n()

const uuids = ref<string[]>([])
const uppercase = ref(false)
const hyphens = ref(true)

function fmt(u: string): string {
  let s = u
  if (!hyphens.value) s = s.replace(/-/g, '')
  if (uppercase.value) s = s.toUpperCase()
  return s
}

function generate(n: number) {
  uuids.value = Array.from({ length: n }, () => fmt(crypto.randomUUID()))
}

function applyFmt() {
  uuids.value = uuids.value.map(() => fmt(crypto.randomUUID()))
}

const hint = computed(() => t('impl.uuid-generator.hint'))

generate(5)
</script>

<template>
  <Stack class="tool-body">
    <Row>
      <BaseButton variant="primary" @click="generate(1)">
        <AppIcon name="refresh" :size="14" />{{ t('impl.uuid-generator.generate') }}
      </BaseButton>
      <BaseButton @click="generate(5)">{{ t('impl.uuid-generator.generate5') }}</BaseButton>
      <label class="check">
        <input v-model="uppercase" type="checkbox" @change="applyFmt" />
        {{ t('impl.uuid-generator.uppercase') }}
      </label>
      <label class="check">
        <input v-model="hyphens" type="checkbox" @change="applyFmt" />
        {{ t('impl.uuid-generator.hyphens') }}
      </label>
      <span class="hint">{{ hint }}</span>
    </Row>

    <OutputBox scroll :empty="uuids.length === 0">
      <div v-for="(u, i) in uuids" :key="i" class="uuid-row">
        <span class="uuid">{{ u }}</span>
        <CopyButton :text="() => u" />
      </div>
    </OutputBox>
  </Stack>
</template>

<style scoped>
.tool-body {
  padding: var(--sp-6);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  background: var(--surface);
}
.check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--muted);
}
.hint {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted-2);
}
.uuid-row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 5px 0;
  border-bottom: 1px solid var(--border-soft);
}
.uuid-row:last-child { border-bottom: none; }
.uuid {
  flex: 1;
  word-break: break-all;
  color: var(--accent-text);
}
</style>
