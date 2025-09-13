# @wasdadeel/state

Minimal external-state primitives with **typed events**:
- `createState<T>` — state container with `getState`, `setState`, and typed events.
- `createBoolean()` — boolean helper on top of `createState`.
- `createCounter()` — counter with increment/decrement/reset events.

---

## Install

```bash
npm i @wasdadeel/state
# or
yarn add @wasdadeel/state
```

## Quick Start

### `createState()`

```
import { createState } from '@wasdadeel/state';

const $user = createState({ id: '1', name: 'Andrei' });

$user.on('change', ({ prevState, newState }) => {
  console.log(prevState, '→', newState);
});

$user.setState({ id: '2', name: 'Andrew' });
console.log($user.getState()); // { id: '2', name: 'Andrew' }
```


### `createBoolean()`
```
import { createBoolean } from '@wasdadeel/state';

const $flag = createBoolean(false);

$flag.on('setTrue', ({ prevState, newState }) => {});
$flag.on('setFalse', ({ prevState, newState }) => {});
$flag.on('change', ({ prevState, newState }) => {});

$flag.setTrue();
$flag.setFalse();
$flag.toggle();

// read synchronously
const v = $flag.getState();
```

### `createCounter()`
```
import { createCounter } from '@wasdadeel/state';

const counter = createCounter(0);

counter.on('increment', ({ prevState, newState }) => {});
counter.on('decrement', ({ prevState, newState }) => {}); // note: event name matches code
counter.on('reset', ({ prevState, newState }) => {});

counter.increment(); // 1
counter.decrement(); // 0
counter.getState();
counter.reset();     // back to initial
```


## API Reference
`createState<T>(initial: T | (() => T)) => CreatedState<T>`

Returns:
- `getState(): T` — current value, always fresh
- `setState(next: T | (prev: T) => T, options?: { shouldEmit?: boolean | (event: 'setState' | 'change') => boolean }): void`
- `on(event, listener): () => void `— subscribe to 'setState' | 'change'

Event payload shapes:
```
type SetStateEvent<T> = { newState: T };
type ChangeEvent<T> = { prevState: T; newState: T };
```

#### `createBoolean(initial: boolean | (() => boolean)) => CreatedBoolean`
- `getState()`, `setState(next)`, `setTrue()`, `setFalse()`, `toggle()`
- `on('setTrue' | 'setFalse' | 'change', listener)`

#### `createCounter(initial?: number) => CreatedCounter`
- `getState()`, `increment()`, `decrement()`, `reset()`
- `on('increment' | 'decrement' | 'change' | 'reset', listener)`
- `once(...)` also available


## Why this library?

- **External state first** — read without waiting for React render

- **Typed events** — predictable side-effects

- **Zero deps** — easy to audit

- **Small surface** — primitives only


## Types & Utilities
```
import type { CreatedState, CreatedStateReader, CreatedStateInfer } from '@wasdadeel/state';

// Example:
const $user = createState({ id: '1', name: 'A' });
type User = CreatedStateInfer<typeof $user>; // { id: string; name: string }
```

### Notes
- `shouldEmit` lets you suppress `setState`/`change` notifications, or only allow specific ones.


## License

MIT © Andrei Balashov
