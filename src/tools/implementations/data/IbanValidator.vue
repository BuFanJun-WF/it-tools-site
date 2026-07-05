<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextInput from '@/components/ui/TextInput.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import KvList from '@/components/ui/KvList.vue'
import Stack from '@/components/ui/Stack.vue'
import TagBadge from '@/components/ui/TagBadge.vue'

const { t } = useI18n()

const input = ref('GB82 WEST 1234 5698 7654 32')

// ISO country name lookup (subset covering IBAN countries)
const COUNTRY_NAMES: Record<string, string> = {
  GB: 'United Kingdom', DE: 'Germany', FR: 'France', IT: 'Italy', ES: 'Spain',
  NL: 'Netherlands', BE: 'Belgium', CH: 'Switzerland', AT: 'Austria', PT: 'Portugal',
  IE: 'Ireland', LU: 'Luxembourg', SE: 'Sweden', NO: 'Norway', DK: 'Denmark',
  FI: 'Finland', PL: 'Poland', US: 'United States', CN: 'China', JP: 'Japan',
  KR: 'South Korea', IN: 'India', CA: 'Canada', AU: 'Australia', BR: 'Brazil',
  MX: 'Mexico', RU: 'Russia', ZA: 'South Africa', TR: 'Turkey', SA: 'Saudi Arabia',
  AE: 'United Arab Emirates', SG: 'Singapore', HK: 'Hong Kong', TW: 'Taiwan',
}

function mod97(rearranged: string): number {
  // Process in chunks to avoid BigInt for moderate-length IBANs — but BigInt is safest.
  let remainder = 0
  for (const ch of rearranged) {
    remainder = (remainder * 10 + Number(ch)) % 97
  }
  return remainder
}

const result = computed(() => {
  const raw = input.value.replace(/\s+/g, '').toUpperCase()
  if (!raw) return null
  if (raw.length < 15 || !/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(raw)) {
    return { ok: false, country: '', bban: '', checksum: '', formatted: '' }
  }
  const country = raw.slice(0, 2)
  const checksum = raw.slice(2, 4)
  const bban = raw.slice(4)
  // Rearrange: BBAN + country code (as digits) + check digits
  const letterVal = (ch: string) => String(ch.charCodeAt(0) - 55) // A=10, B=11...
  const rearranged = bban + letterVal(country[0]) + letterVal(country[1]) + checksum
  const valid = mod97(rearranged) === 1

  const formatted = raw.replace(/(.{4})/g, '$1 ').trim()
  return {
    ok: valid,
    country: `${country} — ${COUNTRY_NAMES[country] ?? 'Unknown'}`,
    bban,
    checksum,
    formatted,
  }
})

const invalid = computed(() => input.value.trim() !== '' && result.value && !result.value.ok && !result.value.country)
</script>

<template>
  <Stack class="tool-body">
    <div>
      <FieldLabel>{{ t('impl.iban-validator-and-parser.input') }}</FieldLabel>
      <TextInput v-model="input" :placeholder="t('impl.iban-validator-and-parser.placeholder')" mono />
    </div>

    <template v-if="result">
      <div class="status-row">
        <TagBadge :variant="result.ok ? 'add' : 'del'">
          {{ result.ok ? t('impl.iban-validator-and-parser.valid') : t('impl.iban-validator-and-parser.invalid') }}
        </TagBadge>
      </div>
      <KvList :items="[
        { label: t('impl.iban-validator-and-parser.country'), value: result.country || '—' },
        { label: t('impl.iban-validator-and-parser.bban'), value: result.bban || '—' },
        { label: t('impl.iban-validator-and-parser.checksum'), value: result.checksum || '—' },
        { label: t('impl.iban-validator-and-parser.formatted'), value: result.formatted || '—' },
      ]" />
    </template>

    <OutputBox v-else empty>{{ invalid ? t('impl.iban-validator-and-parser.invalid') : '—' }}</OutputBox>
  </Stack>
</template>

<style scoped>
.tool-body {
  padding: var(--sp-6);
  border-radius: var(--r-lg);
  border: 1px solid var(--border);
  background: var(--surface);
}
.status-row { display: flex; }
</style>
