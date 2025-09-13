# @wasdadeel/common

Essential utilities for TypeScript projects:
- **Text** — formatting, tokenization, number spacing
- **HTML** — escape/unescape HTML entities
- **Promise** — concurrency control with `promisePool`
- **Clipboard** — cross-browser clipboard operations
- **Environment** — safe env var access with fallbacks
- **Cookies** — cookie parsing and setting utilities
- **JWT** — JSON Web Token creation and verification
- **Render** — animation loop with FPS control
- **Tree** — tree traversal algorithms
- **Teardown** — resource cleanup and disposal management
- **Tools** — timing, validation, and environment detection
- **Types** — `DeepReadonly`, `NonFunction` utilities

---

## Install

```bash
npm i @wasdadeel/common
# or
yarn add @wasdadeel/common
```

## Quick Start

### Text utilities
```ts
import { spacedThousands, tokenizeText } from '@wasdadeel/common';

spacedThousands(1234); // "1 234"
tokenizeText("Hello. World!"); // ["Hello.", "World!"]
```

### Promise concurrency
```ts
import { promisePool } from '@wasdadeel/common';

const results = await promisePool(
  [() => fetch('/api/1'), () => fetch('/api/2'), () => fetch('/api/3')],
  2, // max 2 concurrent
  { onProgress: ({ finishedTasks, totalTasks }) => 
    console.log(`${finishedTasks}/${totalTasks}`) 
  }
);
```

### HTML escaping
```ts
import { escapeHtml, unescapeHtml } from '@wasdadeel/common';

escapeHtml('<script>alert("xss")</script>'); 
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"

unescapeHtml('&lt;div&gt;'); // "<div>"
```

### Environment variables
```ts
import { getEnv, getEnvIntOrThrow } from '@wasdadeel/common';

const apiKey = getEnv('API_KEY'); // string | null
const port = getEnvIntOrThrow('PORT'); // number (throws if missing)
```

### Clipboard operations
```ts
import { copyToClipboard, requestClipboardReadAccess } from '@wasdadeel/common';

await copyToClipboard({ 
  textPlain: 'Hello', 
  textHtml: '<b>Hello</b>' 
});

const canRead = await requestClipboardReadAccess();
```

### Cookie management
```ts
import { setCookie, getCookies, parseCookies } from '@wasdadeel/common';

setCookie('theme', 'dark', { 
  expires: '2024-12-31', 
  sameSite: 'Lax' 
});

const cookies = getCookies(); // { theme: 'dark', ... }
const parsed = parseCookies('a=1; b=2'); // { a: '1', b: '2' }
```

### JWT tokens
```ts
import { createJWT } from '@wasdadeel/common';

const jwt = createJWT({ secret: 'your-secret' });

const token = jwt.sign({ payload: 'user123', expiresIn: 3600000 });
const payload = jwt.verify({ token }); // 'user123' | null
```

### Animation loop
```ts
import { createRenderLoop } from '@wasdadeel/common';

const loop = createRenderLoop(() => {
  // Your animation code here
  console.log('Frame rendered');
}, { fps: 60 });

loop.start();
// loop.stop() when done
```

### Tree traversal
```ts
import { postorderTraversal, postorderTraversalSearch } from '@wasdadeel/common';

const tree = { id: 1, children: [{ id: 2 }, { id: 3 }] };

postorderTraversal(tree, node => node.children, (node, idx) => {
  console.log(`Node ${node.id} at index ${idx}`);
});

const found = postorderTraversalSearch(tree, node => node.children, 
  node => node.id === 2
); // { id: 2 } | null
```

### Teardown management
```ts
import { createTeardown } from '@wasdadeel/common';

const teardown = createTeardown();

// Add cleanup callbacks
teardown.add(() => {
  console.log('Cleaning up subscription 1');
});

teardown.add(() => {
  console.log('Cleaning up subscription 2');
});

// Cleanup all remaining callbacks
teardown.reset(); // Runs all remaining callbacks in reverse order
```

### Utility tools
```ts
import { wait, isValidEmail, CAN_USE_DOM, MINUTE } from '@wasdadeel/common';

// Timing utilities
await wait(1000); // Wait 1 second
const threeMinutes = 3 * MINUTE; // 180000ms

// Email validation
isValidEmail('user@example.com'); // true
isValidEmail('invalid-email'); // false

// Environment detection
if (CAN_USE_DOM) {
  // Running in browser environment
  document.body.innerHTML = 'Hello!';
}
```

## API Reference

**Text:** `spacedThousands()`, `tokenizeText()`, `splitThousands()`

**HTML:** `escapeHtml()`, `unescapeHtml()`, `escapeHtmlStrings()`, `unescapeHtmlStrings()`

**Promise:** `promisePool(functions, limit, options?)`

**Clipboard:** `copyToClipboard()`, `requestClipboardReadAccess()`, `getClipboardItemsAsDataTransfer()`

**Environment:** `getEnv()`, `getEnvOrThrow()`, `getEnvInt()`, `getEnvIntOrThrow()`

**Cookies:** `setCookie()`, `getCookies()`, `parseCookies()`

**JWT:** `createJWT(secret)`, `jwt.sign()`, `jwt.verify()`, `jwt.verifyOrThrow()`

**Render:** `createRenderLoop(callback, options?)`, `loop.start()`, `loop.stop()`, `loop.getStatus()`

**Tree:** `postorderTraversal()`, `postorderTraversalSearch()`

**Teardown:** `createTeardown()`, `teardown.add()`, `teardown.reset()`, `teardown.getSize()`

**Types:** `DeepReadonly<T>`, `NonFunction`, `deepFreeze()`

**Tools:** `wait(duration)`, `isValidEmail(str)`, `CAN_USE_DOM`, `MINUTE`, `EMAIL_REGEXP`

## Why this library?

- **Zero deps** — lightweight and auditable
- **TypeScript-first** — full type safety
- **Browser + Node** — universal compatibility
- **Essential only** — no bloat

## License

MIT © Andrei Balashov
