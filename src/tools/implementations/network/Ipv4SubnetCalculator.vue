<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextInput from '@/components/ui/TextInput.vue'
import KvList from '@/components/ui/KvList.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import Stack from '@/components/ui/Stack.vue'

const { t } = useI18n()

const input = ref('192.168.1.0/24')

function ipToInt(ip: string): number | null {
  const m = ip.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!m) return null
  const parts = m.slice(1, 5).map(Number)
  if (parts.some(p => p > 255)) return null
  return ((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]
}
function intToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}

const result = computed(() => {
  const m = input.value.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/)
  if (!m) return null
  const ipInt = ipToInt(m[1])
  const prefix = Number(m[2])
  if (ipInt === null || prefix > 32) return null
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  const wildcard = (~mask) >>> 0
  const network = (ipInt & mask) >>> 0
  const broadcast = (network | wildcard) >>> 0
  // /31（RFC 3021 point-to-point）与 /32 不保留 network/broadcast，
  // 两个地址均为主机地址；其它前缀照常 network+1 … broadcast-1。
  const firstHost = prefix >= 31 ? network : (network + 1) >>> 0
  const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0
  const totalHosts = prefix >= 31 ? (prefix === 32 ? 1 : 2) : (Math.pow(2, 32 - prefix) - 2)
  const ipClass = (() => {
    const first = (network >>> 24) & 255
    if (first < 128) return 'A'
    if (first < 192) return 'B'
    if (first < 224) return 'C'
    if (first < 240) return 'D'
    return 'E'
  })()

  return [
    { label: t('impl.ipv4-subnet-calculator.network'), value: intToIp(network) },
    { label: t('impl.ipv4-subnet-calculator.broadcast'), value: intToIp(broadcast) },
    { label: t('impl.ipv4-subnet-calculator.mask'), value: intToIp(mask) },
    { label: t('impl.ipv4-subnet-calculator.wildcard'), value: intToIp(wildcard) },
    { label: t('impl.ipv4-subnet-calculator.firstHost'), value: intToIp(firstHost) },
    { label: t('impl.ipv4-subnet-calculator.lastHost'), value: intToIp(lastHost) },
    { label: t('impl.ipv4-subnet-calculator.totalHosts'), value: totalHosts.toLocaleString() },
    { label: t('impl.ipv4-subnet-calculator.cidrNotation'), value: `/${prefix}` },
    { label: t('impl.ipv4-subnet-calculator.ipClass'), value: ipClass },
  ]
})

const invalid = computed(() => input.value.trim() !== '' && !result.value)
</script>

<template>
  <Stack class="tool-body">
    <div>
      <FieldLabel>{{ t('impl.ipv4-subnet-calculator.input') }}</FieldLabel>
      <TextInput v-model="input" :placeholder="t('impl.ipv4-subnet-calculator.placeholder')" mono />
    </div>

    <KvList v-if="result" :items="result" />

    <OutputBox v-else empty>{{ invalid ? t('impl.ipv4-subnet-calculator.invalid') : '—' }}</OutputBox>
  </Stack>
</template>

<style scoped>
</style>
