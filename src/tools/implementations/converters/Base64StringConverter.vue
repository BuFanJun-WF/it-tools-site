<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextArea from '@/components/ui/TextArea.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Grid2 from '@/components/ui/Grid2.vue'
import Stack from '@/components/ui/Stack.vue'
import Row from '@/components/ui/Row.vue'

const { t } = useI18n()

const text = ref('hello world')
const b64 = ref('')

// Encode: text -> base64 (UTF-8 safe)
const encoded = computed(() => {
  try {
    return btoa(unescape(encodeURIComponent(text.value)))
  } catch {
    return ''
  }
})

// Decode: base64 -> text (UTF-8 safe)
const decoded = computed(() => {
  if (!b64.value.trim()) return ''
  try {
    return decodeURIComponent(escape(atob(b64.value.trim())))
  } catch {
    return ''
  }
})

const decodeInvalid = computed(() => b64.value.trim() !== '' && decoded.value === '')

function loadExample() {
  b64.value = 'aGVsbG8gd29ybGQ='
}
</script>

<template>
  <Stack class="tool-body">
    <Grid2>
      <Stack>
        <div>
          <FieldLabel>{{ t('impl.base64-string-converter.encode') }}</FieldLabel>
          <TextArea v-model="text" :mono="false" :placeholder="t('impl.base64-string-converter.phEncode')" :min-height="120" />
        </div>
        <div>
          <Row justify="space-between" style="margin-bottom: var(--sp-2);">
            <FieldLabel style="margin-bottom: 0;">{{ t('impl.base64-string-converter.outEncode') }}</FieldLabel>
            <CopyButton v-if="encoded" :text="() => encoded" />
          </Row>
          <OutputBox>{{ encoded || '—' }}</OutputBox>
        </div>
      </Stack>

      <Stack>
        <div>
          <Row justify="space-between" style="align-items: baseline; margin-bottom: var(--sp-2);">
            <FieldLabel style="margin-bottom: 0;">{{ t('impl.base64-string-converter.decode') }}</FieldLabel>
            <button class="link-btn" @click="loadExample">aGVsbG8gd29ybGQ=</button>
          </Row>
          <TextArea v-model="b64" :placeholder="t('impl.base64-string-converter.phDecode')" :min-height="120" />
        </div>
        <div>
          <Row justify="space-between" style="margin-bottom: var(--sp-2);">
            <FieldLabel style="margin-bottom: 0;">{{ t('impl.base64-string-converter.outDecode') }}</FieldLabel>
            <CopyButton v-if="decoded" :text="() => decoded" />
          </Row>
          <OutputBox :empty="decodeInvalid">{{ decoded || (decodeInvalid ? t('impl.base64-string-converter.invalid') : '—') }}</OutputBox>
        </div>
      </Stack>
    </Grid2>
  </Stack>
</template>

<style scoped>
.link-btn {
  background: none;
  border: none;
  color: var(--accent-text);
  font-family: var(--font-mono);
  font-size: var(--fs-xs);
  cursor: pointer;
  padding: 0;
}
.link-btn:hover { text-decoration: underline; }
</style>
