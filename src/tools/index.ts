/* =========================================================================
   Tool registry — lazy-loaded Vue SFC implementations
   Each entry maps a tool id to a dynamic import. Only tools listed here
   render their interactive UI; others fall back to <ComingSoon />.
   ========================================================================= */

import type { Component } from 'vue'

export const toolRegistry: Record<string, () => Promise<{ default: Component }>> = {
  // Crypto
  'hash-text': () => import('@/tools/implementations/crypto/HashText.vue'),
  'uuid-generator': () => import('@/tools/implementations/crypto/UuidGenerator.vue'),

  // Converters
  'base64-string-converter': () => import('@/tools/implementations/converters/Base64StringConverter.vue'),
  'json-prettify': () => import('@/tools/implementations/converters/JsonPrettify.vue'),
  'date-time-converter': () => import('@/tools/implementations/converters/DateTimeConverter.vue'),

  // Web
  'jwt-parser': () => import('@/tools/implementations/web/JwtParser.vue'),
  'http-status-codes': () => import('@/tools/implementations/web/HttpStatusCodes.vue'),
  'json-diff': () => import('@/tools/implementations/web/JsonDiff.vue'),

  // Images & Videos
  'qrcode-generator': () => import('@/tools/implementations/images/QrCodeGenerator.vue'),

  // Development
  'regex-tester': () => import('@/tools/implementations/development/RegexTester.vue'),
  'crontab-generator': () => import('@/tools/implementations/development/CrontabGenerator.vue'),
  'chmod-calculator': () => import('@/tools/implementations/development/ChmodCalculator.vue'),

  // Network
  'ipv4-subnet-calculator': () => import('@/tools/implementations/network/Ipv4SubnetCalculator.vue'),

  // Math
  'math-evaluator': () => import('@/tools/implementations/math/MathEvaluator.vue'),

  // Measurement
  'temperature-converter': () => import('@/tools/implementations/measurement/TemperatureConverter.vue'),

  // Text
  'emoji-picker': () => import('@/tools/implementations/text/EmojiPicker.vue'),

  // Data
  'iban-validator-and-parser': () => import('@/tools/implementations/data/IbanValidator.vue'),
}
