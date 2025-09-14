# @wasdadeel/react

React hooks and utilities for external state management:
- **External State** — global state without providers using `@wasdadeel/state`
- **State Hooks** — `useCreateState`, `useCreateBoolean`, `useCreateCounter`
- **Utility Hooks** — `useFactory`, `useRefOutput`, `useSyncEffect`
- **Render Hooks** — `useForceUpdate`, `useIsFirstRender`, `useRendersCount`
- **Context** — `createContext` with type-safe providers
- **Event System** — React-compatible event emitters
- **Key Listeners** — keyboard event management

---

## Install

```bash
npm i @wasdadeel/react
# or
yarn add @wasdadeel/react
```

## Quick Start

### State Management
```tsx
import { useCreateState, useCreateBoolean, useCreateCounter } from '@wasdadeel/react';

function MyComponent() {
  // Create state with React integration
  const user = useCreateState({ name: 'John', age: 30 });
  
  // Boolean state with React hooks
  const visible = useCreateBoolean(false);
  
  // Counter with React integration
  const count = useCreateCounter(0);

  return (
    <div>
      <p>User: {user.state.name}</p>
      <button onClick={() => user.setState({ ...user.getState(), age: 31 })}>
        Increment Age
      </button>
      
      <button onClick={visible.toggle}>
        {visible.state ? 'Hide' : 'Show'}
      </button>
      
      <p>Count: {count.state}</p>
      <button onClick={count.increment}>+</button>
    </div>
  );
}
```

### External State Management
```tsx
import { createState } from '@wasdadeel/state';
import { useCreatedState } from '@wasdadeel/react';

// Create external state - accessible anywhere without providers
const $user = createState<{name: string} | null>(null);

// Hook to use external state in React components
const useUser = () => useCreatedState($user);

function UserProfile() {
  const user = useUser();
  
  return (
    <div>
      {user.state ? (
        <p>Welcome, {user.state.name}!</p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}

function LoginButton() {
  const user = useUser();
  
  const handleLogin = () => user.setState({ name: 'John', email: 'john@example.com' });
  
  const handleLogout = () => user.setState(null);
  
  return (
    <div>
      {user.state ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}

// Both components automatically rerender when $user changes
// No providers needed - state is truly global

// You can also update state outside of React components
// All dependent components will automatically rerender
$user.setState({ name: 'Jane', email: 'jane@example.com' });

// Example: Update from API call
fetch('/api/user').then(res => res.json()).then(userData => {
  $user.setState(userData); // React components automatically update
});

// Example: Update from WebSocket
websocket.on('userUpdate', (data) => {
  $user.setState(data); // All subscribed components rerender
});
```

### Utility Hooks
```tsx
import { useFactory, useRefOutput, useSyncEffect } from '@wasdadeel/react';

function MyComponent() {
  // Create stable reference to expensive object
  const config = useFactory(() => createTeardown()); 
  
  // Maintain immutable reference to latest values
  const latestValue = useRefOutput(useMyHook());
  useEffect(() => {}, [latestValue]);
  
  // Sync effect that runs on first render
  useSyncEffect(() => {
    console.log('First render');
    return () => console.log('Component unmounted');
  });

  return <div>My Component</div>;
}
```

### Context Management
```tsx
import { createContext } from '@wasdadeel/react';

// Create typed context
const {Provider: UserProvider, useContextOrThrow: useUser} = createContext('UserContext', (initialUser: { name: string }) => ({
  user: initialUser,
  isLoggedIn: true
}));

function App() {
  return (
    <UserProvider initialValue={{ name: 'John' }}>
      <UserProfile />
    </UserProvider>
  );
}

function UserProfile() {
  const { user, isLoggedIn } = useUser();
  
  return <div>Welcome, {user.name}!</div>;
}
```

### Render Utilities
```tsx
import { useForceUpdate, useIsFirstRender, useRendersCount } from '@wasdadeel/react';

function MyComponent() {
  const forceUpdate = useForceUpdate();
  const isFirstRender = useIsFirstRender();
  const rendersCount = useRendersCount();

  return (
    <div>
      <p>Renders: {rendersCount}</p>
      {isFirstRender && <p>First render!</p>}
      <button onClick={forceUpdate}>Force Update</button>
    </div>
  );
}
```

### Event Handling
```tsx
import { useCreateState } from '@wasdadeel/react';

function MyComponent() {
  const state = useCreateState({ count: 0 });

  // React-compatible event subscription
  state.useOn('change', ({ newState, prevState }) => {
    console.log(`Count changed from ${prevState.count} to ${newState.count}`);
  });

  return (
    <button onClick={() => state.setState({ count: state.state.count + 1 })}>
      Count: {state.state.count}
    </button>
  );
}
```

## API Reference

**State Hooks:** `useCreateState()`, `useCreateBoolean()`, `useCreateCounter()`

**Utility Hooks:** `useFactory()`, `useRefOutput()`, `useSyncEffect()`, `useOnUnmount()`, `useIsMounted()`

**Render Hooks:** `useForceUpdate()`, `useIsFirstRender()`, `useRendersCount()`, `useOnFirstRender()`

**Context:** `createContext()`, `context.useContext()`, `context.useContextOrThrow()`

**Event System:** `createReactEmitter()`, `emitter.useOn()`

**Teardown:** `useOnUnmount()`, `useIsMounted()`

**Key Listeners:** `useKeyListeners()`, `useKeyDown()`, `useKeyUp()`

## Why this library?

- **External state first** — read state without waiting for React render
- **React 18+ compatible** — uses `useSyncExternalStore` for optimal performance
- **TypeScript-first** — full type safety with excellent IntelliSense
- **Zero deps** — lightweight and auditable
- **Familiar API** — works seamlessly with existing React patterns

## License

MIT © Andrei Balashov
