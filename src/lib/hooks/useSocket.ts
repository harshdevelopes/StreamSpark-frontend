import { useState, useEffect, useCallback, useRef } from "react";
import socketService from "../socket";

/**
 * Custom hook for using the socket service in React components
 * @param events Events to subscribe to
 * @param token Authentication token (optional if already connected)
 * @param debug Enable debug logs for this hook instance
 */
export default function useSocket(
  events: Record<string, (data: any) => void> = {},
  token?: string,
  debug: boolean = process.env.NODE_ENV === "development"
) {
  const [isConnected, setIsConnected] = useState<boolean>(
    socketService.isConnected()
  );
  const [status, setStatus] = useState<"connected" | "disconnected" | "error">(
    socketService.getConnectionStatus()
  );
  const componentName = useRef(
    `Component_${Math.random().toString(36).substring(2, 7)}`
  );

  // Connect to socket server if token is provided
  useEffect(() => {
    if (token && !socketService.isConnected()) {
      if (debug) {
        console.log(
          `[${componentName.current}] Connecting with token ${token.substring(
            0,
            6
          )}...`
        );
      }
      socketService.connect(token);
    }
  }, [token, debug]);

  // Handle connection status changes
  useEffect(() => {
    const handleConnectionStatus = (newStatus: string) => {
      if (debug) {
        console.log(
          `[${componentName.current}] Connection status changed: ${newStatus}`
        );
      }
      setStatus(newStatus as "connected" | "disconnected" | "error");
      setIsConnected(newStatus === "connected");
    };

    socketService.on("connectionStatusChanged", handleConnectionStatus);

    return () => {
      socketService.off("connectionStatusChanged", handleConnectionStatus);
    };
  }, [debug]);

  // Create wrapped event handlers that include logging
  const wrappedHandlers = useRef<Record<string, Function>>({});

  // We need to recreate wrapped handlers when events object changes
  useEffect(() => {
    wrappedHandlers.current = {};

    Object.entries(events).forEach(([eventName, handler]) => {
      // Create a wrapped handler that logs before calling the original
      wrappedHandlers.current[eventName] = (...args: any[]) => {
        if (debug) {
          console.log(
            `[${componentName.current}] Event triggered: ${eventName}`,
            args
          );
        }
        // Call the original handler
        handler(...args);
      };
    });
  }, [events, debug]);

  // Subscribe to events using the wrapped handlers
  useEffect(() => {
    if (debug) {
      console.log(
        `[${componentName.current}] Subscribing to events:`,
        Object.keys(events)
      );
    }

    // Register all event listeners using wrapped handlers
    Object.entries(events).forEach(([event]) => {
      socketService.on(event, wrappedHandlers.current[event]);
    });

    // Cleanup on unmount
    return () => {
      if (debug) {
        console.log(
          `[${componentName.current}] Unsubscribing from events:`,
          Object.keys(events)
        );
      }

      Object.entries(events).forEach(([event]) => {
        socketService.off(event, wrappedHandlers.current[event]);
      });
    };
  }, [events, debug]);

  // Helper to send events to the server
  const sendEvent = useCallback(
    (event: string, ...args: any[]) => {
      if (debug) {
        console.log(`[${componentName.current}] Sending event: ${event}`, args);
      }
      socketService.send(event, ...args);
    },
    [debug]
  );

  // Helper to connect manually
  const connect = useCallback(
    (newToken: string) => {
      if (debug) {
        console.log(
          `[${
            componentName.current
          }] Manual connect with token ${newToken.substring(0, 6)}...`
        );
      }
      socketService.connect(newToken);
    },
    [debug]
  );

  // Helper to disconnect manually
  const disconnect = useCallback(() => {
    if (debug) {
      console.log(`[${componentName.current}] Manual disconnect requested`);
    }
    socketService.disconnect();
  }, [debug]);

  // Set component name
  const setComponentName = useCallback((name: string) => {
    componentName.current = name;
  }, []);

  return {
    isConnected,
    status,
    sendEvent,
    connect,
    disconnect,
    setComponentName,
  };
}
