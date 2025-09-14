# wasdadeel

A collection of minimal, zero-dependency TypeScript utilities

## Packages

### Core Libraries

| Package | Description | NPM | README |
|---------|-------------|-----|--------|
| [**@wasdadeel/emitter**](./packages/emitter) | Tiny, strongly-typed event emitter | [![npm](https://img.shields.io/npm/v/@wasdadeel/emitter)](https://www.npmjs.com/package/@wasdadeel/emitter) | [📖](./packages/emitter/README.md) |
| [**@wasdadeel/state**](./packages/state) | Minimal external-state primitives with typed events | [![npm](https://img.shields.io/npm/v/@wasdadeel/state)](https://www.npmjs.com/package/@wasdadeel/state) | [📖](./packages/state/README.md) |
| [**@wasdadeel/common**](./packages/common) | Essential utilities for TypeScript projects | [![npm](https://img.shields.io/npm/v/@wasdadeel/common)](https://www.npmjs.com/package/@wasdadeel/common) | [📖](./packages/common/README.md) |

### React Integration

| Package | Description | NPM | README |
|---------|-------------|-----|--------|
| [**@wasdadeel/react**](./packages/react) | React hooks and utilities for external state management | [![npm](https://img.shields.io/npm/v/@wasdadeel/react)](https://www.npmjs.com/package/@wasdadeel/react) | [📖](./packages/react/README.md) |

## Quick Start

```bash
# Install individual packages
npm install @wasdadeel/state @wasdadeel/react

# Or install all packages
npm install @wasdadeel/emitter @wasdadeel/state @wasdadeel/common @wasdadeel/react
```

## Philosophy

- **Zero dependencies** — lightweight and auditable
- **TypeScript-first** — full type safety with excellent IntelliSense
- **Minimal API** — essential functionality only
- **External state** — read state without waiting for React render
- **Universal** — works in browser and Node.js environments

## License

MIT © Andrei Balashov
