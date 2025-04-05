# Socket Service Documentation

This document provides guidance on using the centralized Socket.IO implementation in the SuperTip application.

## Overview

The socket service is implemented as a singleton to maintain a single connection across the application, which helps with:

- Reducing connection overhead
- Centralizing authentication logic
- Providing consistent event handling
- Enabling multiple components to use the same connection
- Providing detailed logging for debugging

## Basic Usage

### Directly Using the Socket Service

```typescript
import socketService from "@/lib/socket";

// Connect with token
socketService.connect("STREAMER_UNIQUE_ALERT_TOKEN");

// Subscribe to events
socketService.on("new_tip", (data) => {
  console.log("New tip received:", data);
});

// Unsubscribe when done
socketService.off("new_tip", myHandlerFunction);

// Send events to the server
socketService.send("my_event", { data: "some data" });

// Check connection status
if (socketService.isConnected()) {
  // Do something when connected
}

// Disconnect when no longer needed
// Note: Only disconnect if you're sure no other components need the connection
socketService.disconnect();
```

### Using the React Hook (Recommended)

```typescript
import { useCallback, useEffect } from "react";
import useSocket from "@/lib/hooks/useSocket";

function MyComponent({ token }) {
  // Handle incoming events - always use useCallback
  const handleNewTip = useCallback((data) => {
    console.log("New tip received:", data);
  }, []);

  // Use the hook with event handlers and token
  const { isConnected, status, sendEvent, setComponentName } = useSocket(
    {
      new_tip: handleNewTip,
    },
    token
  );

  // Set component name for better debugging (recommended)
  useEffect(() => {
    setComponentName("MyComponent");
  }, [setComponentName]);

  // Send events to server
  const sendSomething = () => {
    sendEvent("my_event", { data: "some data" });
  };

  return (
    <div>
      <p>Connection status: {status}</p>
      <button onClick={sendSomething} disabled={!isConnected}>
        Send Event
      </button>
    </div>
  );
}
```

## Available Events

### Server to Client

| Event Name                | Payload                                          | Description                         |
| ------------------------- | ------------------------------------------------ | ----------------------------------- |
| `new_tip`                 | `{ name, amount, currency, message, soundUrl? }` | When a new tip is received          |
| `chat_message`            | `{ user, text }`                                 | When a new chat message is received |
| `connectionStatusChanged` | `"connected"` / `"disconnected"` / `"error"`     | When connection status changes      |

### Client to Server

| Event Name     | Payload    | Description                       |
| -------------- | ---------- | --------------------------------- |
| `chat_message` | `{ text }` | Send a chat message to the server |

## Authentication

The socket connection requires a token to authenticate:

```typescript
// Get token from API or other source
const token = await getAlertToken();

// Connect with token
socketService.connect(token);
```

## Advanced Usage

### Multiple Event Listeners

```typescript
// Component A
useSocket(
  {
    new_tip: handleNewTip,
  },
  token
);

// Component B (in another part of the app)
useSocket(
  {
    new_tip: differentHandler,
    chat_message: handleChat,
  },
  token
);
```

Both components will receive events, but the socket connection is only established once.

### Connection Management

The socket service automatically handles:

- Reconnection on network issues
- Authentication with token
- Event subscription management
- Connection status tracking
- Detailed logging of all events

## Debugging Socket Events

The socket service includes comprehensive debugging capabilities to help troubleshoot connection issues and track events.

### Enabling Debug Logging

You can enable detailed debug logs for the entire socket service:

```typescript
import { setSocketDebug } from "@/lib/socket";

// Enable debug mode
setSocketDebug(true);

// Disable when done
setSocketDebug(false);
```

### Component-Level Debugging

The `useSocket` hook accepts a debug parameter:

```typescript
// Third parameter enables debug mode for this component only
const { isConnected, status } = useSocket(eventHandlers, token, true);
```

In development mode, debugging is enabled by default. You can explicitly disable it:

```typescript
// Explicitly disable debug mode for production environments
const { isConnected, status } = useSocket(eventHandlers, token, false);
```

### Setting Component Name

For better debugging logs, set a component name:

```typescript
const { setComponentName } = useSocket(eventHandlers, token);

useEffect(() => {
  setComponentName("UserDashboard");
}, [setComponentName]);
```

This will prefix all logs from this component with the component name, making it easier to trace events across multiple components.

### Debug Console Output Format

Debug logs include:

- Socket-level logs: `Socket: Action description`
- Component-level logs: `[ComponentName] Action description`
- Event tracking: `Socket: Emitting "event_name" to X listeners`
- Connection status: `Socket: Connected to http://server-url`
- Error details: `Socket: Error in event handler for "event_name": [error details]`

Example console output:

```
Socket: Connecting with token 123456...
Socket: Connected to http://localhost:3001
[TipAlertPage] Connection status changed: connected
Socket: Adding listener for "new_tip"
[TipAlertPage] Subscribing to events: new_tip
Socket: Received event "new_tip" [Object]
Socket: Emitting "new_tip" to 1 listeners [Object]
[TipAlertPage] Event triggered: new_tip [Object]
TipAlert: Processing new tip: {name: "John", amount: "100", currency: "USD"...}
```

### Socket Debugger Tool

The application includes a dedicated debugging page at `/debug-socket` that provides:

- Real-time event monitoring
- Manual event sending
- Connection status visualization
- Event history with timestamps

This page is useful for troubleshooting and testing socket functionality without modifying application code.

#### Using the Debugger Page

1. Navigate to `/debug-socket` in your browser
2. Enter your alert token
3. Click "Connect"
4. The event log will show all events received
5. Use the "Send Event" section to manually trigger events

## Error Handling

The socket service provides robust error handling:

- Connection errors are logged with detailed information
- Event handler errors are caught and logged, preventing them from crashing the application
- Reconnection is automatically attempted on disconnections

## TypeScript Support

All events and handlers are fully typed for better development experience:

```typescript
// Define your event types for better type safety
interface TipEvent {
  name: string;
  amount: string;
  currency: CurrencyCode;
  message?: string;
  soundUrl?: string;
}

// Use with typed handlers
const handleNewTip = useCallback((data: TipEvent) => {
  // TypeScript will validate the properties you access
  console.log(`New tip from ${data.name} for ${data.amount}`);
}, []);
```

## Best Practices

1. **Use the hook when possible** - `useSocket` handles subscription cleanup automatically
2. **Define handlers with useCallback** - To prevent unnecessary re-renders
3. **Only connect once** - Let the singleton manage connections
4. **Unsubscribe from events** - When your component unmounts
5. **Handle connection status** - Always check if the socket is connected before sending events
6. **Add component names** - Makes logs easier to trace when debugging
7. **Enable debug mode during development** - Get detailed insights into socket activity
8. **Use the debugger page for troubleshooting** - Simplifies testing and verification
