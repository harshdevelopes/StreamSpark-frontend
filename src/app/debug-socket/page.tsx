"use client";

import React, { useState, useEffect, useCallback } from "react";
import { setSocketDebug } from "@/lib/socket";
import useSocket from "@/lib/hooks/useSocket";

/**
 * Socket Debug Page - Use this to troubleshoot socket connections
 */
export default function SocketDebugPage() {
  const [token, setToken] = useState<string>("");
  const [isDebugEnabled, setIsDebugEnabled] = useState<boolean>(false);
  const [eventLogs, setEventLogs] = useState<
    Array<{ time: string; event: string; data: any }>
  >([]);
  const [manualEvent, setManualEvent] = useState<string>("");
  const [manualData, setManualData] = useState<string>("{}");

  // Enable global socket debugging
  useEffect(() => {
    setSocketDebug(true);

    return () => {
      // Disable when leaving the page
      setSocketDebug(false);
    };
  }, []);

  // Generic event handler for any event
  const handleAnyEvent = useCallback((data: any) => {
    setEventLogs((prev) => [
      {
        time: new Date().toISOString().substring(11, 23),
        event: "any_event",
        data,
      },
      ...prev.slice(0, 49), // Only keep the last 50 events
    ]);
  }, []);

  // Socket connection with debug enabled
  const {
    isConnected,
    status,
    sendEvent,
    connect,
    disconnect,
    setComponentName,
  } = useSocket(
    {
      // Listen for custom event
      any_event: handleAnyEvent,
      // Generic handler for any event
      "*": (eventName: string, ...args: any[]) => {
        setEventLogs((prev) => [
          {
            time: new Date().toISOString().substring(11, 23),
            event: eventName,
            data: args,
          },
          ...prev.slice(0, 49),
        ]);
      },
    },
    token || undefined,
    true // Force debug mode
  );

  // Set component name for logs
  useEffect(() => {
    setComponentName("SocketDebugger");
  }, [setComponentName]);

  // Handle connection with token
  const handleConnect = useCallback(() => {
    if (token) {
      connect(token);
    }
  }, [token, connect]);

  // Send manual event
  const handleSendEvent = useCallback(() => {
    try {
      const data = JSON.parse(manualData);
      sendEvent(manualEvent, data);
    } catch (error) {
      console.error("Invalid JSON:", error);
      alert("Invalid JSON data. Please check the console.");
    }
  }, [manualEvent, manualData, sendEvent]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Socket Debugger</h1>

      {/* Connection Panel */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Connection</h2>

        <div className="flex items-start gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Alert Token
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your alert token"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mt-6">
            {isConnected ? (
              <button
                onClick={disconnect}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={!token}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Connect
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              status === "connected"
                ? "bg-green-500"
                : status === "error"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          ></span>
          <span className="text-sm">Status: {status}</span>
        </div>
      </div>

      {/* Manual Event Sender */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Send Event</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Name</label>
            <input
              type="text"
              value={manualEvent}
              onChange={(e) => setManualEvent(e.target.value)}
              placeholder="e.g., chat_message"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Event Data (JSON)
            </label>
            <textarea
              value={manualData}
              onChange={(e) => setManualData(e.target.value)}
              placeholder='{"key": "value"}'
              className="w-full border rounded px-3 py-2 h-20 font-mono text-sm"
            />
          </div>
        </div>

        <button
          onClick={handleSendEvent}
          disabled={!isConnected || !manualEvent}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Send Event
        </button>
      </div>

      {/* Event Logs */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Event Logs</h2>

        <div className="border rounded overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 font-semibold grid grid-cols-12 text-sm">
            <div className="col-span-2">Time</div>
            <div className="col-span-3">Event</div>
            <div className="col-span-7">Data</div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {eventLogs.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No events received yet. Connect to start receiving events.
              </div>
            ) : (
              eventLogs.map((log, index) => (
                <div
                  key={index}
                  className="px-4 py-2 border-t grid grid-cols-12 text-sm hover:bg-gray-50"
                >
                  <div className="col-span-2 font-mono">{log.time}</div>
                  <div className="col-span-3 font-semibold">{log.event}</div>
                  <div className="col-span-7 font-mono text-xs overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(log.data, null, 2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={() => setEventLogs([])}
          className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Clear Logs
        </button>
      </div>
    </div>
  );
}
