import { io, Socket } from "socket.io-client";

// Singleton pattern for socket instance
class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  private connectionStatus: "connected" | "disconnected" | "error" =
    "disconnected";
  private socketUrl: string =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  private debug: boolean = process.env.NODE_ENV === "development";

  private constructor() {
    // Private constructor for singleton pattern
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  /**
   * Enable or disable debug mode
   */
  public setDebug(enabled: boolean): void {
    this.debug = enabled;
  }

  /**
   * Connect to the socket server with a token
   * @param token Authentication token
   * @param options Additional socket.io options
   */
  public connect(token: string, options: any = {}): void {
    if (this.socket) {
      this.disconnect();
    }

    if (this.debug) {
      console.log(`Socket: Connecting with token ${token.substring(0, 6)}...`);
    }

    // Initialize socket connection
    this.socket = io(this.socketUrl, {
      query: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      ...options,
    });

    // Setup standard connection events
    this.socket.on("connect", () => {
      console.log(`Socket: Connected to ${this.socketUrl}`);
      this.connectionStatus = "connected";
      this.emit("connectionStatusChanged", "connected");
    });

    this.socket.on("disconnect", (reason) => {
      console.log(`Socket: Disconnected. Reason: ${reason}`);
      this.connectionStatus = "disconnected";
      this.emit("connectionStatusChanged", "disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error(`Socket: Connection error:`, error);
      this.connectionStatus = "error";
      this.emit("connectionStatusChanged", "error");
    });

    this.socket.on("error", (error) => {
      console.error(`Socket: Error:`, error);
      this.connectionStatus = "error";
      this.emit("connectionStatusChanged", "error");
    });

    // Log all incoming events in debug mode
    if (this.debug) {
      const originalOnEvent = this.socket.onevent;
      this.socket.onevent = (packet) => {
        const args = packet.data || [];
        console.log(`Socket: Received event "${args[0]}"`, args.slice(1));
        originalOnEvent.call(this.socket, packet);
      };
    }
  }

  /**
   * Disconnect the socket
   */
  public disconnect(): void {
    if (this.socket) {
      if (this.debug) {
        console.log(`Socket: Disconnecting...`);
      }
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus = "disconnected";
      this.emit("connectionStatusChanged", "disconnected");
    }
  }

  /**
   * Check if socket is connected
   */
  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get current connection status
   */
  public getConnectionStatus(): "connected" | "disconnected" | "error" {
    return this.connectionStatus;
  }

  /**
   * Subscribe to a socket event
   * @param event Event name
   * @param callback Callback function
   */
  public on(event: string, callback: Function): void {
    if (this.debug) {
      console.log(`Socket: Adding listener for "${event}"`);
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());

      // If this is a new event and socket exists, register it
      if (this.socket && event !== "connectionStatusChanged") {
        this.socket.on(event, (...args: any[]) => {
          if (this.debug) {
            console.log(
              `Socket: Emitting "${event}" to ${
                this.listeners.get(event)?.size || 0
              } listeners`,
              args
            );
          }
          this.emit(event, ...args);
        });
      }
    }

    this.listeners.get(event)?.add(callback);
  }

  /**
   * Unsubscribe from a socket event
   * @param event Event name
   * @param callback Callback function to remove
   */
  public off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (this.debug) {
        console.log(
          `Socket: Removed listener for "${event}". Remaining: ${callbacks.size}`
        );
      }
      if (callbacks.size === 0) {
        this.listeners.delete(event);
        // We're not removing socket.io listeners as they might be needed again
      }
    }
  }

  /**
   * Emit an event to subscribers
   * @param event Event name
   * @param args Arguments to pass to callbacks
   */
  private emit(event: string, ...args: any[]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      if (this.debug) {
        console.log(
          `Socket: Triggering ${callbacks.size} handlers for "${event}"`
        );
      }

      callbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(
            `Socket: Error in event handler for "${event}":`,
            error
          );
        }
      });
    }
  }

  /**
   * Send an event to the server
   * @param event Event name
   * @param args Arguments to send
   */
  public send(event: string, ...args: any[]): void {
    if (this.socket) {
      if (this.debug) {
        console.log(`Socket: Sending "${event}" to server`, args);
      }
      this.socket.emit(event, ...args);
    } else {
      console.warn(`Socket: Cannot send "${event}" - not connected`);
    }
  }
}

// Export singleton instance
const socketService = SocketService.getInstance();

/**
 * Enable or disable socket debug mode globally
 * @param enabled Whether debug mode should be enabled
 */
export const setSocketDebug = (enabled: boolean) => {
  console.log(`Socket: Debug mode ${enabled ? "enabled" : "disabled"}`);
  socketService.setDebug(enabled);
};

export default socketService;
