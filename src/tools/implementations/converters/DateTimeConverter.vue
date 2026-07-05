<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextInput from '@/components/ui/TextInput.vue'
import KvList from '@/components/ui/KvList.vue'
import Stack from '@/components/ui/Stack.vue'
import OutputBox from '@/components/ui/OutputBox.vue'

const { t } = useI18n()

const input = ref('2025-01-15T13:45:30Z')

const date = computed<Date | null>(() => {
  const v = input.value.trim()
  if (!v) return null
  // Allow pure unix seconds / ms
  if (/^\d+$/.test(v)) {
    const n = Number(v)
    const ms = v.length >= 13 ? n : n * 1000
    const d = new Date(ms)
    return isNaN(d.getTime()) ? null : d
  }
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
})

const invalid = computed(() => input.value.trim() !== '' && !date.value)

function pad(n: number) { return String(n).padStart(2, '0') }

function relative(d: Date): string {
  const diff = d.getTime() - Date.now()
  const abs = Math.abs(diff)
  const sec = Math.round(abs / 1000)
  const min = Math.round(sec / 60)
  const hr = Math.round(min / 60)
  const day = Math.round(hr / 24)
  const yr = Math.round(day / 365)
  const fmt = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`
  let body: string
  if (sec < 60) body = fmt(sec, 'second')
  else if (min < 60) body = fmt(min, 'minute')
  else if (hr < 24) body = fmt(hr, 'hour')
  else if (day < 365) body = fmt(day, 'day')
  else body = fmt(yr, 'year')
  return diff >= 0 ? `in ${body}` : `${body} ago`
}

const rows = computed(() => {
  const d = date.value
  if (!d) return []
  return [
    { label: t('impl.date-time-converter.unixSeconds'), value: String(Math.floor(d.getTime() / 1000)) },
    { label: t('impl.date-time-converter.unixMs'), value: String(d.getTime()) },
    { label: t('impl.date-time-converter.iso'), value: d.toISOString() },
    { label: t('impl.date-time-converter.rfc'), value: d.toUTCString() },
    { label: t('impl.date-time-converter.local'), value: d.toLocaleString() },
    { label: t('impl.date-time-converter.dateOnly'), value: d.toLocaleDateString() },
    { label: t('impl.date-time-converter.timeOnly'), value: d.toLocaleTimeString() },
    { label: t('impl.date-time-converter.relative'), value: relative(d) },
    { label: 'UTC', value: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}` },
  ]
})
</script>

<template>
  <Stack class="tool-body">
    <div>
      <FieldLabel>{{ t('impl.date-time-converter.input') }}</FieldLabel>
      <TextInput v-model="input" :placeholder="t('impl.date-time-converter.placeholder')" />
    </div>

    <div v-if="date">
      <FieldLabel>{{ t('impl.date-time-converter.formats') }}</FieldLabel>
      <KvList :items="rows" />
    </div>

    <OutputBox v-else empty>{{ invalid ? t('impl.date-time-converter.invalid') : '—' }}</OutputBox>
  </Stack>
</template>

<style scoped>
</style>
