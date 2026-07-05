<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextArea from '@/components/ui/TextArea.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import Grid2 from '@/components/ui/Grid2.vue'
import Stack from '@/components/ui/Stack.vue'

const { t } = useI18n()

const left = ref('{\n  "name": "Alice",\n  "age": 30\n}')
const right = ref('{\n  "name": "Alice",\n  "age": 31,\n  "city": "Beijing"\n}')

interface Line { type: 'ctx' | 'add' | 'del'; text: string }

function flatten(obj: unknown, prefix = ''): Map<string, unknown> {
  const out = new Map<string, unknown>()
  if (obj === null || typeof obj !== 'object') {
    out.set(prefix || '$', obj)
    return out
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      for (const [k, val] of flatten(v, `${prefix}[${i}]`)) out.set(k, val)
    })
    return out
  }
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    for (const [kk, val] of flatten(v, prefix ? `${prefix}.${k}` : k)) out.set(kk, val)
  }
  return out
}

const diff = computed<{ lines: Line[]; identical: boolean; error: string }>(() => {
  let lp: unknown, rp: unknown
  try {
    lp = JSON.parse(left.value)
  } catch (e) {
    return { lines: [], identical: false, error: `Left: ${(e as Error).message}` }
  }
  try {
    rp = JSON.parse(right.value)
  } catch (e) {
    return { lines: [], identical: false, error: `Right: ${(e as Error).message}` }
  }
  const lm = flatten(lp)
  const rm = flatten(rp)
  const keys = new Set([...lm.keys(), ...rm.keys()])
  const lines: Line[] = []
  let identical = true
  for (const k of [...keys].sort()) {
    const lv = lm.get(k)
    const rv = rm.get(k)
    if (lm.has(k) && rm.has(k)) {
      if (JSON.stringify(lv) === JSON.stringify(rv)) {
        lines.push({ type: 'ctx', text: `${k}: ${JSON.stringify(lv)}` })
      } else {
        identical = false
        lines.push({ type: 'del', text: `- ${k}: ${JSON.stringify(lv)}` })
        lines.push({ type: 'add', text: `+ ${k}: ${JSON.stringify(rv)}` })
      }
    } else if (lm.has(k)) {
      identical = false
      lines.push({ type: 'del', text: `- ${k}: ${JSON.stringify(lv)}` })
    } else {
      identical = false
      lines.push({ type: 'add', text: `+ ${k}: ${JSON.stringify(rv)}` })
    }
  }
  return { lines, identical, error: '' }
})
</script>

<template>
  <Stack class="tool-body">
    <Grid2>
      <div>
        <FieldLabel>{{ t('impl.json-diff.leftLabel') }}</FieldLabel>
        <TextArea v-model="left" :placeholder="t('impl.json-diff.placeholder')" :min-height="160" />
      </div>
      <div>
        <FieldLabel>{{ t('impl.json-diff.rightLabel') }}</FieldLabel>
        <TextArea v-model="right" :placeholder="t('impl.json-diff.placeholder')" :min-height="160" />
      </div>
    </Grid2>

    <div>
      <FieldLabel>{{ t('common.error') }}</FieldLabel>
      <OutputBox v-if="diff.error" empty>{{ diff.error }}</OutputBox>
      <OutputBox v-else-if="diff.identical" empty>{{ t('impl.json-diff.identical') }}</OutputBox>
      <pre v-else class="diff-out"><code
        v-for="(line, i) in diff.lines"
        :key="i"
        :class="['diff-line', `diff-${line.type}`]"
      >{{ line.text }}</code></pre>
    </div>
  </Stack>
</template>

<style scoped>
.tool-body {
  padding: var(--sp-6);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  background: var(--surface);
}
.diff-out {
  margin: 0;
  padding: var(--sp-3);
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  line-height: 1.6;
  overflow: auto;
  max-height: 420px;
}
.diff-line { display: block; white-space: pre-wrap; word-break: break-all; }
.diff-line.diff-add { color: var(--diff-add-fg); background: var(--diff-add-bg); }
.diff-line.diff-del { color: var(--diff-del-fg); background: var(--diff-del-bg); }
.diff-line.diff-ctx { color: var(--muted); }
</style>
