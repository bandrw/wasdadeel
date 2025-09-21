# @wasdadeel/fetcher

Minimal, typed `fetch` wrapper with:

- tiny API: `get / post / put / patch / delete`
- middleware pipeline
- global `baseUrl`
- lifecycle hooks: `beforeFetch` / `afterFetch`
- `redirect()` helper (browser)
- `clone()` to fork configuration

Works in **browser** and **Node 18+** (uses global `fetch` and `AbortController`).

---

## Install

```bash
npm i @wasdadeel/fetcher
# or
yarn add @wasdadeel/fetcher
```

---

## Quick start

```ts
import { createFetcher } from '@wasdadeel/fetcher';

const api = createFetcher({
  baseUrl: 'https://api.example.com',
  on: {
    beforeFetch: ({ args }) => {
      const [url, init] = args;
      console.log('→', init.method ?? 'GET', url);
    },
    afterFetch: ({ response, args }) => {
      const [url] = args;
      console.log('←', response.status, url);
    },
  },
});

// GET
await api.get('/users');

// POST JSON
await api.post('/users', { body: { name: 'Andrei' } });

// DELETE with query
await api.delete('/users/42?soft=true');
```
