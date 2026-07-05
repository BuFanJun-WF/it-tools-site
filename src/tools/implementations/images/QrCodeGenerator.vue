<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import QRious from 'qrious'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import TextArea from '@/components/ui/TextArea.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Grid2 from '@/components/ui/Grid2.vue'
import Stack from '@/components/ui/Stack.vue'

const { t } = useI18n()

const value = ref('https://example.com')
const size = ref(240)
const level = ref<'L' | 'M' | 'Q' | 'H'>('M')
const fg = ref('#100f0d')
const bg = ref('#ffffff')

const levelOptions = [
  { value: 'L', label: 'L · 7%' },
  { value: 'M', label: 'M · 15%' },
  { value: 'Q', label: 'Q · 25%' },
  { value: 'H', label: 'H · 30%' },
]

const dataUrl = ref('')

function render() {
  if (!value.value.trim()) {
    dataUrl.value = ''
    return
  }
  const qr = new QRious({
    value: value.value,
    size: size.value,
    level: level.value,
    foreground: fg.value,
    background: bg.value,
  })
  dataUrl.value = qr.toDataURL()
}

watch([value, size, level, fg, bg], render, { immediate: true })

function download() {
  if (!dataUrl.value) return
  const a = document.createElement('a')
  a.href = dataUrl.value
  a.download = 'qrcode.png'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>

<template>
  <Stack class="tool-body">
    <Grid2 uneven>
      <Stack>
        <div>
          <FieldLabel>{{ t('impl.qrcode-generator.value') }}</FieldLabel>
          <TextArea v-model="value" :mono="false" :placeholder="t('impl.qrcode-generator.placeholder')" :min-height="80" />
        </div>
        <div>
          <FieldLabel>{{ t('impl.qrcode-generator.size') }}: {{ size }}px</FieldLabel>
          <input v-model.number="size" type="range" min="64" max="512" step="8" class="range" />
        </div>
        <div class="two-col">
          <div>
            <FieldLabel>{{ t('impl.qrcode-generator.level') }}</FieldLabel>
            <SelectInput v-model="level" :options="levelOptions" />
          </div>
        </div>
        <div class="two-col">
          <div>
            <FieldLabel>{{ t('impl.qrcode-generator.foreground') }}</FieldLabel>
            <input v-model="fg" type="color" class="color" />
          </div>
          <div>
            <FieldLabel>{{ t('impl.qrcode-generator.background') }}</FieldLabel>
            <input v-model="bg" type="color" class="color" />
          </div>
        </div>
      </Stack>

      <div class="preview">
        <div v-if="dataUrl" class="canvas-wrap">
          <img :src="dataUrl" alt="QR code" />
        </div>
        <div v-else class="placeholder">{{ t('impl.qrcode-generator.invalid') }}</div>
        <BaseButton variant="primary" :disabled="!dataUrl" @click="download">
          {{ t('impl.qrcode-generator.download') }}
        </BaseButton>
      </div>
    </Grid2>
  </Stack>
</template>

<style scoped>
.range { width: 100%; accent-color: var(--accent); }
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
}
.color {
  width: 100%;
  height: 40px;
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface);
  cursor: pointer;
  padding: 4px;
}
.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-4);
  padding: var(--sp-4);
  border-radius: var(--r-md);
  background: var(--surface-2);
  border: 1px solid var(--border);
}
.canvas-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  padding: var(--sp-3);
  border-radius: var(--r-sm);
}
.canvas-wrap img { display: block; max-width: 100%; height: auto; }
.placeholder {
  color: var(--muted-2);
  font-size: var(--fs-sm);
  padding: var(--sp-8);
  text-align: center;
}
</style>
