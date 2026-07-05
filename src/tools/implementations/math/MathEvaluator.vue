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

// Allowed Math functions and constants — single source for both validation
// and the rewriter that prefixes them with `Math.`.
const FUNCS = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'log', 'log2', 'log10', 'abs', 'ceil', 'floor', 'round', 'exp', 'sign', 'min', 'max', 'pow']
const CONSTS = ['PI', 'E']
const ALLOWED = [...FUNCS, ...CONSTS]
// `(?<!\.)` 避免把用户已写出的 `Math.sin` / `Math.PI` 二次前缀为 `Math.Math.xxx`。
const FN_RE = new RegExp(`(?<!\\.)\\b(${FUNCS.join('|')})\\b`, 'g')
const CONST_RE = new RegExp(`(?<!\\.)\\b(${CONSTS.join('|')})\\b`, 'g')

const input = ref('2 + 3 * (4 - 1)')

const result = computed(() => {
  const expr = input.value.trim()
  if (!expr) return { ok: false, value: '', error: '' }
  // Disallow anything that isn't math: digits, operators, parens, decimal, space, and named Math.* functions
  if (!/^[\d+\-*/().,%\s^a-z]+$/i.test(expr)) {
    return { ok: false, value: '', error: t('impl.math-evaluator.invalid') }
  }
  try {
    for (const name of ALLOWED) {
      if (expr.includes(name) && !(name in Math)) return { ok: false, value: '', error: t('impl.math-evaluator.invalid') }
    }
    // Convert ^ to **, prefix allowed names with Math., then evaluate
    const safe = expr
      .replace(/\^/g, '**')
      .replace(FN_RE, 'Math.$1')
      .replace(CONST_RE, 'Math.$&')
    // eslint-disable-next-line no-new-func
    const fn = new Function(`"use strict"; return (${safe});`)
    const val = fn()
    if (typeof val !== 'number' || !isFinite(val)) return { ok: false, value: '', error: t('impl.math-evaluator.invalid') }
    return { ok: true, value: String(val), error: '' }
  } catch {
    return { ok: false, value: '', error: t('impl.math-evaluator.invalid') }
  }
})
</script>

<template>
  <Stack class="tool-body">
    <div>
      <FieldLabel>{{ t('impl.math-evaluator.input') }}</FieldLabel>
      <TextInput v-model="input" :placeholder="t('impl.math-evaluator.placeholder')" mono />
    </div>

    <div>
      <Row justify="space-between" style="margin-bottom: var(--sp-2);">
        <FieldLabel style="margin-bottom: 0;">{{ t('impl.math-evaluator.result') }}</FieldLabel>
        <CopyButton v-if="result.ok" :text="() => result.value" />
      </Row>
      <OutputBox :empty="!result.ok">{{ result.ok ? result.value : (result.error || '—') }}</OutputBox>
    </div>

    <p class="hint">
      <code>+ - * / %</code> · <code>( )</code> · <code>^</code> · <code>sin cos tan sqrt log abs ceil floor</code> · <code>PI E</code>
    </p>
  </Stack>
</template>

<style scoped>
.hint {
  margin: 0;
  color: var(--muted-2);
  font-size: var(--fs-xs);
}
.hint code {
  color: var(--accent-text);
  background: var(--surface-2);
  padding: 1px 5px;
  border-radius: 3px;
}
</style>
