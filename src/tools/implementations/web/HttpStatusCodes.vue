<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TextInput from '@/components/ui/TextInput.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import Stack from '@/components/ui/Stack.vue'

const { t } = useI18n()

interface Status { code: number; name: string; desc: string; cls: '1xx' | '2xx' | '3xx' | '4xx' | '5xx' }

const STATUSES: Status[] = [
  { code: 100, name: 'Continue', desc: 'The server has received the request headers and the client should proceed to send the request body.', cls: '1xx' },
  { code: 101, name: 'Switching Protocols', desc: 'The requester has asked the server to switch protocols and the server has agreed.', cls: '1xx' },
  { code: 200, name: 'OK', desc: 'Standard response for successful HTTP requests.', cls: '2xx' },
  { code: 201, name: 'Created', desc: 'The request has been fulfilled, resulting in the creation of a new resource.', cls: '2xx' },
  { code: 202, name: 'Accepted', desc: 'The request has been accepted for processing, but the processing has not been completed.', cls: '2xx' },
  { code: 204, name: 'No Content', desc: 'The server successfully processed the request and is not returning any content.', cls: '2xx' },
  { code: 206, name: 'Partial Content', desc: 'The server is delivering only part of the resource due to a range header.', cls: '2xx' },
  { code: 301, name: 'Moved Permanently', desc: 'This and all future requests should be directed to the given URI.', cls: '3xx' },
  { code: 302, name: 'Found', desc: 'Tells the client to look at another URL for the resource (temporary).', cls: '3xx' },
  { code: 304, name: 'Not Modified', desc: 'The resource has not been modified since the version specified by the request headers.', cls: '3xx' },
  { code: 307, name: 'Temporary Redirect', desc: 'Repeat the request to another URI; same method is used.', cls: '3xx' },
  { code: 308, name: 'Permanent Redirect', desc: 'Use the new URI for all future requests; same method is used.', cls: '3xx' },
  { code: 400, name: 'Bad Request', desc: 'The server cannot process the request due to a client error.', cls: '4xx' },
  { code: 401, name: 'Unauthorized', desc: 'Authentication is required and has failed or has not been provided.', cls: '4xx' },
  { code: 403, name: 'Forbidden', desc: 'The request was valid but the server is refusing action.', cls: '4xx' },
  { code: 404, name: 'Not Found', desc: 'The requested resource could not be found.', cls: '4xx' },
  { code: 405, name: 'Method Not Allowed', desc: 'The request method is not supported for the requested resource.', cls: '4xx' },
  { code: 408, name: 'Request Timeout', desc: 'The server timed out waiting for the request.', cls: '4xx' },
  { code: 409, name: 'Conflict', desc: 'The request could not be processed because of conflict in the current state of the resource.', cls: '4xx' },
  { code: 410, name: 'Gone', desc: 'The resource is no longer available and will not be available again.', cls: '4xx' },
  { code: 418, name: "I'm a Teapot", desc: 'The server refuses to brew coffee because it is, permanently, a teapot.', cls: '4xx' },
  { code: 422, name: 'Unprocessable Entity', desc: 'The request was well-formed but unable to be followed due to semantic errors.', cls: '4xx' },
  { code: 429, name: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time.', cls: '4xx' },
  { code: 500, name: 'Internal Server Error', desc: 'A generic error message; server encountered an unexpected condition.', cls: '5xx' },
  { code: 501, name: 'Not Implemented', desc: 'The server does not recognise the request method, or lacks the ability to fulfil it.', cls: '5xx' },
  { code: 502, name: 'Bad Gateway', desc: 'The server received an invalid response from an upstream server.', cls: '5xx' },
  { code: 503, name: 'Service Unavailable', desc: 'The server cannot handle the request (overloaded or down for maintenance).', cls: '5xx' },
  { code: 504, name: 'Gateway Timeout', desc: 'The upstream server failed to send a request in time.', cls: '5xx' },
]

const filter = ref('')

const results = computed(() => {
  const q = filter.value.trim().toLowerCase()
  if (!q) return STATUSES
  return STATUSES.filter(s =>
    String(s.code).includes(q) || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q),
  )
})

const clsColor: Record<Status['cls'], string> = {
  '1xx': 'tag-default',
  '2xx': 'tag-add',
  '3xx': 'tag-accent',
  '4xx': 'tag-del',
  '5xx': 'tag-del',
}
</script>

<template>
  <Stack class="tool-body">
    <div class="search-row">
      <AppIcon name="search" :size="16" class="search-ic" />
      <TextInput v-model="filter" :placeholder="t('impl.http-status-codes.search')" />
    </div>

    <div class="grid">
      <article v-for="s in results" :key="s.code" class="status-card">
        <header>
          <span :class="['tag', clsColor[s.cls]]">{{ s.code }}</span>
          <span class="name">{{ s.name }}</span>
        </header>
        <p>{{ s.desc }}</p>
      </article>
    </div>

    <p v-if="!results.length" class="muted-line">{{ t('impl.http-status-codes.noMatch') }}</p>
  </Stack>
</template>

<style scoped>
.search-row { position: relative; }
.search-ic {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-2);
}
.search-row :deep(.input) { padding-left: 38px; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--sp-3);
}
.status-card {
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--r-md);
  border: 1px solid var(--border);
  background: var(--surface-2);
}
.status-card header {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  margin-bottom: 6px;
}
.status-card .name {
  font-weight: 600;
  color: var(--text-strong);
  font-size: var(--fs-sm);
}
.status-card p {
  margin: 0;
  color: var(--muted);
  font-size: var(--fs-xs);
  line-height: 1.5;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--r-sm);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  background: var(--surface-3);
  color: var(--muted);
}
.tag-add { background: var(--diff-add-bg); color: var(--diff-add-fg); }
.tag-del { background: var(--diff-del-bg); color: var(--diff-del-fg); }
.tag-accent { background: var(--accent-soft); color: var(--accent-text); }
.tag-default { background: var(--surface-3); color: var(--muted); }

.muted-line { color: var(--muted); text-align: center; padding: var(--sp-6); }
</style>
