<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import FieldLabel from '@/components/ui/FieldLabel.vue'
import OutputBox from '@/components/ui/OutputBox.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import Stack from '@/components/ui/Stack.vue'
import Grid2 from '@/components/ui/Grid2.vue'
import TagBadge from '@/components/ui/TagBadge.vue'

const { t } = useI18n()

type Who = 'owner' | 'group' | 'others'
type Perm = 'read' | 'write' | 'execute'

const state = reactive<Record<Who, Record<Perm, boolean>>>({
  owner: { read: true, write: true, execute: false },
  group: { read: true, write: false, execute: false },
  others: { read: true, write: false, execute: false },
})

function digit(who: Who): number {
  let d = 0
  if (state[who].read) d += 4
  if (state[who].write) d += 2
  if (state[who].execute) d += 1
  return d
}

const octal = computed(() => `${digit('owner')}${digit('group')}${digit('others')}`)

function symbolic(who: Who, letter: string): string {
  let s = ''
  if (state[who].read) s += 'r'
  if (state[who].write) s += 'w'
  if (state[who].execute) s += 'x'
  return `${letter}${s}`
}

const symbolicStr = computed(() => `${symbolic('owner', 'u')},${symbolic('group', 'g')},${symbolic('others', 'o')}`)
const command = computed(() => `chmod ${octal.value} file`)

const sections: { key: Who; letter: string }[] = [
  { key: 'owner', letter: 'u' },
  { key: 'group', letter: 'g' },
  { key: 'others', letter: 'o' },
]
const perms: { key: Perm; label: string; val: string }[] = [
  { key: 'read', label: t('impl.chmod-calculator.read'), val: '4' },
  { key: 'write', label: t('impl.chmod-calculator.write'), val: '2' },
  { key: 'execute', label: t('impl.chmod-calculator.execute'), val: '1' },
]

function reverseFromOctal(o: string) {
  const parts = [o.slice(0, 1), o.slice(1, 2), o.slice(2, 3)].map(Number)
  const whos: Who[] = ['owner', 'group', 'others']
  whos.forEach((w, i) => {
    const d = parts[i] || 0
    state[w].read = (d & 4) === 4
    state[w].write = (d & 2) === 2
    state[w].execute = (d & 1) === 1
  })
}

let manualOctal = ''
function onOctalInput(e: Event) {
  manualOctal = (e.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 3)
  if (manualOctal.length === 3) reverseFromOctal(manualOctal)
}
</script>

<template>
  <Stack class="tool-body">
    <Grid2>
      <Stack v-for="sec in sections" :key="sec.key" :gap="8">
        <div class="who-head">
          <strong>{{ t(`impl.chmod-calculator.${sec.key}`) }}</strong>
          <TagBadge>{{ sec.letter }}</TagBadge>
        </div>
        <label v-for="p in perms" :key="p.key" class="perm">
          <input v-model="state[sec.key][p.key]" type="checkbox" />
          <span class="perm-label">{{ p.label }}</span>
          <span class="perm-val">{{ p.val }}</span>
        </label>
      </Stack>
    </Grid2>

    <Grid2>
      <div>
        <FieldLabel>{{ t('impl.chmod-calculator.octal') }}</FieldLabel>
        <div class="result-row">
          <input class="octal-input" :value="octal" @input="onOctalInput" maxlength="3" />
          <CopyButton :text="() => octal" />
        </div>
      </div>
      <div>
        <FieldLabel>{{ t('impl.chmod-calculator.symbolic') }}</FieldLabel>
        <OutputBox>{{ symbolicStr }}</OutputBox>
      </div>
    </Grid2>

    <div>
      <FieldLabel>{{ t('impl.chmod-calculator.command') }}</FieldLabel>
      <div class="result-row">
        <OutputBox style="flex: 1;">{{ command }}</OutputBox>
        <CopyButton :text="() => command" />
      </div>
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
.who-head {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  margin-bottom: var(--sp-2);
  color: var(--text-strong);
  font-size: var(--fs-sm);
}
.perm {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: var(--sp-2) var(--sp-3);
  border-radius: var(--r-md);
  background: var(--surface-2);
  cursor: pointer;
  font-size: var(--fs-sm);
}
.perm:hover { background: var(--surface-3); }
.perm-label { flex: 1; color: var(--text); }
.perm-val {
  font-family: var(--font-mono);
  color: var(--muted-2);
  font-size: var(--fs-xs);
}
.result-row {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}
.octal-input {
  flex: 1;
  height: 40px;
  padding: 0 var(--sp-3);
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: var(--fs-md);
  letter-spacing: 0.2em;
}
.octal-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
</style>
