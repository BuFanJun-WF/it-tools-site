<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextInput from '@/components/ui/TextInput.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Stack from '@/components/ui/Stack.vue'
import Row from '@/components/ui/Row.vue'

const { t } = useI18n()

const input = ref('25')
const unit = ref<'C' | 'F' | 'K'>('C')

const units = [
  { value: 'C', label: '°C' },
  { value: 'F', label: '°F' },
  { value: 'K', label: 'K' },
]

function toC(v: number, u: 'C' | 'F' | 'K'): number {
  if (u === 'F') return (v - 32) * 5 / 9
  if (u === 'K') return v - 273.15
  return v
}
function fromC(c: number, u: 'C' | 'F' | 'K'): number {
  if (u === 'F') return c * 9 / 5 + 32
  if (u === 'K') return c + 273.15
  return c
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

const outputs = computed(() => {
  const v = Number(input.value)
  if (input.value.trim() === '' || isNaN(v)) return null
  const c = toC(v, unit.value)
  return [
    { label: t('impl.temperature-converter.celsius'), value: round(fromC(c, 'C')) + ' °C' },
    { label: t('impl.temperature-converter.fahrenheit'), value: round(fromC(c, 'F')) + ' °F' },
    { label: t('impl.temperature-converter.kelvin'), value: round(fromC(c, 'K')) + ' K' },
  ]
})

const invalid = computed(() => input.value.trim() !== '' && isNaN(Number(input.value)))
</script>

<template>
  <Stack class="tool-body">
    <Row :wrap="true" style="align-items: flex-end;">
      <div style="flex: 1; min-width: 200px;">
        <FieldLabel>{{ t('impl.temperature-converter.input') }}</FieldLabel>
        <TextInput v-model="input" mono />
      </div>
      <div>
        <FieldLabel>{{ '' }}</FieldLabel>
        <div class="seg">
          <button v-for="u in units" :key="u.value" :class="['seg-btn', unit === u.value && 'active']" @click="unit = (u.value as 'C' | 'F' | 'K')">{{ u.label }}</button>
        </div>
      </div>
    </Row>

    <div v-if="outputs" class="results">
      <div v-for="o in outputs" :key="o.label" class="result-card">
        <div class="r-label">{{ o.label }}</div>
        <div class="r-value">{{ o.value }}</div>
        <CopyButton :text="() => o.value" />
      </div>
    </div>

    <OutputBox v-else empty>{{ invalid ? t('impl.temperature-converter.invalid') : '—' }}</OutputBox>
  </Stack>
</template>

<style scoped>
.tool-body {
  padding: var(--sp-6);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  background: var(--surface);
}
.seg {
  display: inline-flex;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  overflow: hidden;
}
.seg-btn {
  height: 40px;
  padding: 0 var(--sp-4);
  background: var(--surface);
  border: none;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  font-weight: 600;
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.seg-btn:hover { background: var(--surface-2); color: var(--text); }
.seg-btn.active { background: var(--accent); color: #fff; }

.results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--sp-3);
}
.result-card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  padding: var(--sp-4);
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface-2);
}
.r-label {
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted-2);
}
.r-value {
  font-family: var(--font-mono);
  font-size: var(--fs-lg);
  color: var(--accent-text);
}
</style>
