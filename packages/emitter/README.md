# @wasdadeel/emitter

A tiny, strongly-typed event emitter for TypeScript projects.  
Built to be minimal, predictable, and dependency-free.

---

## Installation

```bash
npm install @wasdadeel/emitter
# or
yarn add @wasdadeel/emitter
```

## Usage

```
import { createEventEmitter } from "@wasdadeel/emitter";

// define your event map
type Events = {
  message: string;
  count: number;
};

const emitter = createEventEmitter<Events>();

// subscribe
const off = emitter.on("message", (msg) => {
  console.log("Got message:", msg);
});

// emit
emitter.emit("message", "Hello world!");

// unsubscribe
off();

// once
emitter.once("count", (n) => {
  console.log("Count fired once:", n);
});

emitter.emit("count", 1);
emitter.emit("count", 2); // won't fire
```

## API

`createEventEmitter<T>()`

Creates a typed event emitter.

The returned emitter has the following methods:

- `on(event, listener): () => void`
  
  Subscribe to an event. Returns an unsubscribe function.

- `once(event, listener): () => void`
  
  Subscribe to an event once. Automatically removed after first call.
  
  Returns a manual unsubscribe.

- `off(event, listener): void`
  
  Remove a listener previously added with on.

- `offOnce(event, listener): void`
  
  Remove a listener previously added with once.

- `emit(event, payload): void`
  
  Trigger all listeners for a given event.

## Why?

- No dependencies
- Simple source code - copy/paste & customize & be happy
