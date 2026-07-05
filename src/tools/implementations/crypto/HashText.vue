<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { sha3_256 } from 'js-sha3'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextArea from '@/components/ui/TextArea.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Stack from '@/components/ui/Stack.vue'

const { t } = useI18n()

const input = ref('hello world')
const algo = ref('SHA-256')
const uppercase = ref(true)
const hex = ref('')

const algorithms = [
  { value: 'SHA-1', label: 'SHA-1' },
  { value: 'SHA-256', label: 'SHA-256' },
  { value: 'SHA-384', label: 'SHA-384' },
  { value: 'SHA-512', label: 'SHA-512' },
  { value: 'SHA-3', label: 'SHA-3 (256)' },
]

async function compute() {
  const data = new TextEncoder().encode(input.value)
  try {
    let out: string
    if (algo.value === 'SHA-3') {
      out = sha3_256(data)
    } else {
      const buf = await crypto.subtle.digest(algo.value, data)
      out = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
    }
    hex.value = uppercase.value ? out.toUpperCase() : out
  } catch {
    hex.value = ''
  }
}

// Recompute whenever input, algorithm, or casing changes (incl. first run).
watch([input, algo, uppercase], compute, { immediate: true })
</script>

<template>
  <Stack class="tool-body">
    <div>
      <FieldLabel>{{ t('impl.hash-text.textLabel') }}</FieldLabel>
      <TextArea v-model="input" :placeholder="t('impl.hash-text.placeholder')" :min-height="120" />
    </div>

    <div class="controls">
      <FieldLabel style="margin-bottom: 0;">{{ t('impl.hash-text.algorithm') }}</FieldLabel>
      <SelectInput v-model="algo" :options="algorithms" style="max-width: 200px;" />
      <label class="check">
        <input v-model="uppercase" type="checkbox" />
        {{ t('impl.hash-text.uppercase') }}
      </label>
    </div>

    <div>
      <div class="out-head">
        <FieldLabel style="margin-bottom: 0;">{{ t('impl.hash-text.digest') }}</FieldLabel>
        <CopyButton :text="() => hex" />
      </div>
      <OutputBox>{{ hex || '—' }}</OutputBox>
    </div>
  </Stack>
</template>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  flex-wrap: wrap;
}
.check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--fs-sm);
  color: var(--muted);
}
.out-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--sp-2);
}
</style>
