<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextArea from '@/components/ui/TextArea.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import TagBadge from '@/components/ui/TagBadge.vue'
import Stack from '@/components/ui/Stack.vue'

const { t } = useI18n()

const input = ref('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')

interface Part { raw: string; pretty: string }
const parsed = computed<{ header: Part | null; payload: Part | null; signature: string } | null>(() => {
  const v = input.value.trim()
  if (!v) return null
  const parts = v.split('.')
  if (parts.length !== 3) return null
  try {
    const decode = (s: string): Part => {
      const json = JSON.parse(atob(s.replace(/-/g, '+').replace(/_/g, '/')))
      return { raw: s, pretty: JSON.stringify(json, null, 2) }
    }
    return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] }
  } catch {
    return null
  }
})

const invalid = computed(() => input.value.trim() !== '' && !parsed.value)
</script>

<template>
  <Stack class="tool-body">
    <div>
      <FieldLabel>{{ t('impl.jwt-parser.input') }}</FieldLabel>
      <TextArea v-model="input" :placeholder="t('impl.jwt-parser.placeholder')" :min-height="100" />
    </div>

    <OutputBox v-if="!parsed" empty>{{ invalid ? t('impl.jwt-parser.invalid') : '—' }}</OutputBox>

    <template v-else>
      <div>
        <FieldLabel>
          {{ t('impl.jwt-parser.header') }}
          <TagBadge variant="accent" style="margin-left: 8px;">{{ parsed.header?.raw.slice(0, 24) }}…</TagBadge>
        </FieldLabel>
        <OutputBox>{{ parsed.header?.pretty }}</OutputBox>
      </div>
      <div>
        <FieldLabel>{{ t('impl.jwt-parser.payload') }}</FieldLabel>
        <OutputBox>{{ parsed.payload?.pretty }}</OutputBox>
      </div>
      <div>
        <FieldLabel>{{ t('impl.jwt-parser.signature') }}</FieldLabel>
        <OutputBox>{{ parsed.signature }}</OutputBox>
      </div>
    </template>
  </Stack>
</template>

<style scoped>
</style>
