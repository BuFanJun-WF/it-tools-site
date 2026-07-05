<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextInput from '@/components/ui/TextInput.vue'
import TextArea from '@/components/ui/TextArea.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import Stack from '@/components/ui/Stack.vue'
import Row from '@/components/ui/Row.vue'
import TagBadge from '@/components/ui/TagBadge.vue'

const { t } = useI18n()

const pattern = ref('\\b(\\w+)@(\\w+\\.\\w+)\\b')
const flags = ref('g')
const text = ref('Contact alice@example.com or bob@test.org for details.')

interface Match { match: string; index: number; groups: string[] }

const result = computed<{ matches: Match[]; highlighted: string; error: string }>(() => {
  if (!pattern.value) return { matches: [], highlighted: escapeHtml(text.value), error: '' }
  let re: RegExp
  try {
    re = new RegExp(pattern.value, flags.value.includes('g') ? flags.value : flags.value + 'g')
  } catch (e) {
    return { matches: [], highlighted: escapeHtml(text.value), error: (e as Error).message }
  }
  const matches: Match[] = []
  let m: RegExpExecArray | null
  let lastIdx = 0
  let html = ''
  let any = false
  while ((m = re.exec(text.value)) !== null) {
    any = true
    matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
    html += escapeHtml(text.value.slice(lastIdx, m.index))
    html += `<mark>${escapeHtml(m[0])}</mark>`
    lastIdx = m.index + m[0].length
    if (m.index === re.lastIndex) re.lastIndex++
  }
  html += escapeHtml(text.value.slice(lastIdx))
  void any
  return { matches, highlighted: html, error: '' }
})

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c)
}

const matchCount = computed(() => result.value.matches.length)
</script>

<template>
  <Stack class="tool-body">
    <div class="pattern-row">
      <div style="flex: 1;">
        <FieldLabel>{{ t('impl.regex-tester.pattern') }}</FieldLabel>
        <TextInput v-model="pattern" mono />
      </div>
      <div style="width: 100px;">
        <FieldLabel>{{ t('impl.regex-tester.flags') }}</FieldLabel>
        <TextInput v-model="flags" mono />
      </div>
    </div>

    <div>
      <FieldLabel>{{ t('impl.regex-tester.textLabel') }}</FieldLabel>
      <TextArea v-model="text" :mono="false" :placeholder="t('impl.regex-tester.textPlaceholder')" :min-height="120" />
    </div>

    <div>
      <Row justify="space-between" style="margin-bottom: var(--sp-2);">
        <FieldLabel style="margin-bottom: 0;">{{ t('impl.regex-tester.textLabel') }}</FieldLabel>
        <TagBadge v-if="result.error" variant="del">{{ t('impl.regex-tester.invalidRegex') }}</TagBadge>
        <TagBadge v-else-if="matchCount" variant="add">{{ t('impl.regex-tester.matches', { n: matchCount }) }}</TagBadge>
        <TagBadge v-else>{{ t('impl.regex-tester.noMatch') }}</TagBadge>
      </Row>
      <OutputBox :empty="!!result.error">
        <div v-if="result.error" class="err">{{ result.error }}</div>
        <code v-else class="highlight" v-html="result.highlighted" />
      </OutputBox>
    </div>

    <div v-if="result.matches.length">
      <FieldLabel>{{ t('impl.regex-tester.matches', { n: matchCount }) }}</FieldLabel>
      <div class="match-list">
        <div v-for="(m, i) in result.matches" :key="i" class="match-item">
          <span class="idx">#{{ i + 1 }}</span>
          <span class="mtxt">{{ m.match }}</span>
          <span v-for="(g, gi) in m.groups" :key="gi" class="grp">${{ gi + 1 }}: {{ g }}</span>
        </div>
      </div>
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
.pattern-row {
  display: flex;
  gap: var(--sp-3);
  align-items: flex-end;
}
.highlight { white-space: pre-wrap; word-break: break-word; }
.highlight :deep(mark) {
  background: var(--accent-soft);
  color: var(--accent-text);
  border-radius: 3px;
  padding: 0 2px;
}
.err { color: var(--rose); }
.match-list { display: flex; flex-direction: column; gap: 6px; }
.match-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--r-sm);
  background: var(--surface-2);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
}
.idx { color: var(--muted-2); }
.mtxt { color: var(--accent-text); }
.grp { color: var(--muted); background: var(--surface-3); padding: 1px 6px; border-radius: 3px; }
</style>
