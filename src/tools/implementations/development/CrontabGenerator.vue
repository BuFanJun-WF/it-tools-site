<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextInput from '@/components/ui/TextInput.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import Stack from '@/components/ui/Stack.vue'
import Row from '@/components/ui/Row.vue'

const { t } = useI18n()

const input = ref('*/5 * * * *')

function parsePart(part: string, min: number, max: number): number[] | null {
  if (part === '*') return Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const out: number[] = []
  for (const chunk of part.split(',')) {
    const stepMatch = chunk.match(/^(\*|\d+(?:-\d+)?)\/(\d+)$/)
    if (stepMatch) {
      const range = stepMatch[1]
      const step = Number(stepMatch[2])
      let lo = min, hi = max
      if (range !== '*') {
        if (range.includes('-')) { const [a, b] = range.split('-'); lo = Number(a); hi = Number(b) }
        else { lo = Number(range); hi = max }
      }
      for (let i = lo; i <= hi; i += step) out.push(i)
    } else if (chunk.includes('-')) {
      const [a, b] = chunk.split('-')
      for (let i = Number(a); i <= Number(b); i++) out.push(i)
    } else if (/^\d+$/.test(chunk)) {
      const n = Number(chunk)
      if (n < min || n > max) return null
      out.push(n)
    } else {
      return null
    }
  }
  return out
}

const description = computed(() => {
  const parts = input.value.trim().split(/\s+/)
  if (parts.length !== 5) return { ok: false, text: '' }
  const [minute, hour, day, month, weekday] = parts
  const m = parsePart(minute, 0, 59)
  const h = parsePart(hour, 0, 23)
  const dom = parsePart(day, 1, 31)
  const mon = parsePart(month, 1, 12)
  const dow = parsePart(weekday, 0, 7)
  if (!m || !h || !dom || !mon || !dow) return { ok: false, text: '' }

  const fmtList = (nums: number[], suffix = '') => {
    if (nums.length > 5) return `every value of ${nums.length} ${suffix}`.trim()
    return nums.join(', ') + suffix
  }

  const minuteEvery = minute === '*'
  const hourEvery = hour === '*'
  const minuteStep = minute.match(/^\*\/(\d+)/)

  let time: string
  if (/^\*\/1$/.test(minute) || minuteEvery) {
    if (minuteStep) {
      time = `every ${minuteStep[1]} minutes`
    } else if (hourEvery) {
      time = 'every minute'
    } else if (h.length === 1) {
      time = `at every minute of hour ${h[0]}`
    } else {
      time = `every minute during hour${h.length > 1 ? 's' : ''} ${fmtList(h)}`
    }
  } else if (minuteStep) {
    time = `every ${minuteStep[1]} minutes`
  } else {
    const mFmt = m.map(n => String(n).padStart(2, '0')).join(',')
    if (hourEvery) time = `at minute ${mFmt} of every hour`
    else {
      const hFmt = h.map(n => String(n).padStart(2, '0')).join(',')
      time = `at minute ${mFmt} of hour${h.length > 1 ? 's' : ''} ${hFmt}`
    }
  }

  const domPart = day === '*' ? '' : (dom.length === 1 ? `on day ${dom[0]}` : `on days ${fmtList(dom)}`)
  const monPart = month === '*' ? '' : (mon.length === 1 ? `in month ${mon[0]}` : `in months ${fmtList(mon)}`)
  const dowPart = weekday === '*' ? '' : `on weekday${dow.length > 1 ? 's' : ''} ${fmtList(dow)}`

  const extras = [domPart, monPart, dowPart].filter(Boolean).join(' ')
  return { ok: true, text: capitalize(`${time}${extras ? ' ' + extras : ''}`) }
})

function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

const examples = [
  { label: '@yearly', val: '0 0 1 1 *' },
  { label: '@monthly', val: '0 0 1 * *' },
  { label: '@weekly', val: '0 0 * * 0' },
  { label: '@daily', val: '0 0 * * *' },
  { label: '@hourly', val: '0 * * * *' },
]
</script>

<template>
  <Stack class="tool-body">
    <div>
      <FieldLabel>{{ t('impl.crontab-generator.input') }}</FieldLabel>
      <TextInput v-model="input" mono placeholder="*/5 * * * *" />
    </div>

    <div>
      <FieldLabel>{{ t('impl.crontab-generator.human') }}</FieldLabel>
      <OutputBox :empty="!description.ok">
        {{ description.ok ? description.text : t('impl.crontab-generator.invalid') }}
      </OutputBox>
    </div>

    <div>
      <FieldLabel>{{ t('impl.crontab-generator.examples') }}</FieldLabel>
      <Row>
        <button v-for="ex in examples" :key="ex.val" class="chip" @click="input = ex.val">
          {{ ex.label }}
        </button>
      </Row>
    </div>
  </Stack>
</template>

<style scoped>
.chip {
  height: 30px;
  padding: 0 var(--sp-3);
  border-radius: var(--r-pill);
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  transition: color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
}
.chip:hover { color: var(--accent-text); border-color: var(--accent); }
</style>
