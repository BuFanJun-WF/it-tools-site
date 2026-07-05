<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextArea from '@/components/ui/TextArea.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Stack from '@/components/ui/Stack.vue'
import Row from '@/components/ui/Row.vue'

const { t } = useI18n()

const input = ref('{\n  "hello": "world",\n  "count": 42\n}')
const indent = ref('2')
const minify = ref(false)

const indentOptions = [
  { value: '2', label: '2 spaces' },
  { value: '4', label: '4 spaces' },
  { value: '\t', label: 'Tabs' },
]

const output = computed(() => {
  const raw = input.value.trim()
  if (!raw) return { value: '', error: '' }
  try {
    const parsed = JSON.parse(raw)
    const value = minify.value
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, indent.value === '\t' ? '\t' : Number(indent.value))
    return { value, error: '' }
  } catch (e) {
    return { value: '', error: (e as Error).message }
  }
})
</script>

<template>
  <Stack class="tool-body">
    <Row :wrap="true">
      <FieldLabel style="margin-bottom: 0;">{{ t('impl.json-prettify.indent') }}</FieldLabel>
      <SelectInput v-model="indent" :options="indentOptions" />
      <label class="check">
        <input v-model="minify" type="checkbox" />
        {{ t('impl.json-prettify.minify') }}
      </label>
    </Row>

    <div>
      <FieldLabel>{{ t('impl.json-prettify.input') }}</FieldLabel>
      <TextArea v-model="input" :placeholder="t('impl.json-prettify.placeholder')" :min-height="180" />
    </div>

    <div>
      <Row justify="space-between" style="margin-bottom: var(--sp-2);">
        <FieldLabel style="margin-bottom: 0;">{{ t('impl.json-prettify.output') }}</FieldLabel>
        <CopyButton v-if="output.value" :text="() => output.value" />
      </Row>
      <OutputBox
        scroll
        :empty="!output.value"
      >{{ output.value || output.error || (input.trim() ? '' : t('impl.json-prettify.empty')) }}</OutputBox>
      <p v-if="output.error" class="err">{{ output.error }}</p>
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
.check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--muted);
}
.err {
  margin-top: var(--sp-2);
  color: var(--rose);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
}
</style>
