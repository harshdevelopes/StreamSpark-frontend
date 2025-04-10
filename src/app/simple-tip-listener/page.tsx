"use client";

import React, { useState, useEffect } from "react";
import io from "socket.io-client";

export default function SimpleTipListener() {
  const [userId, setUserId] = useState("");
  const [connected, setConnected] = useState(false);
  const [tips, setTips] = useState<any[]>([]);
  const [status, setStatus] = useState("disconnected");
  const [socket, setSocket] = useState<any>(null);

  const connectToServer = () => {
    if (!userId) {
      alert("Please enter a user ID");
      return;
    }

    // Clear existing tips
    setTips([]);

    // Create direct connection to backend to receive tips for this user
    const socketUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";
    console.log(`Connecting to ${socketUrl} with userId: ${userId}`);

    try {
      // Create socket connection
      const newSocket = io(socketUrl, {
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        setStatus("connected");
        setConnected(true);

        // Join a room with the user's ID
        // This is a custom event we'll add to the backend
        newSocket.emit("join_user_room", { userId });
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        setStatus(`error: ${error.message}`);
        setConnected(false);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
        setStatus("disconnected");
        setConnected(false);
      });

      // Listen for new tips
      newSocket.on("new_tip", (tipData: any) => {
        console.log("Received tip:", tipData);
        setTips((prev) => [
          {
            ...tipData,
            id: Date.now().toString(), // Just for React key
            receivedAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      });

      setSocket(newSocket);
    } catch (error) {
      console.error("Error creating socket:", error);
      setStatus(`error: ${(error as Error).message}`);
    }
  };

  const disconnectFromServer = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setConnected(false);
      setStatus("disconnected");
    }
  };

  useEffect(() => {
    return () => {
      // Clean up socket on component unmount
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Simple Tip Listener
      </h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
            className="flex-1 px-3 py-2 border rounded text-gray-800"
            disabled={connected}
          />

          {connected ? (
            <button
              onClick={disconnectFromServer}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={connectToServer}
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={!userId}
            >
              Connect
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 my-2">
          <div
            className={`w-3 h-3 rounded-full ${
              status === "connected"
                ? "bg-green-500"
                : status.startsWith("error")
                ? "bg-red-500"
                : "bg-gray-500"
            }`}
          ></div>
          <span className="text-sm text-gray-800">Status: {status}</span>
        </div>

        <div className="text-sm text-gray-600 mt-4">
          <p>Use this command to send a test tip:</p>
          <pre className="bg-gray-100 p-2 rounded mt-1 text-gray-800 overflow-x-auto">
            node test-tip-socket.js {userId || "[USER_ID]"} 50 "Test donation"
          </pre>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Received Tips
        </h2>

        {tips.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tips received yet. Connect to start receiving tips.
          </div>
        ) : (
          <div className="space-y-4">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg text-gray-800">
                      {tip.name} donated {tip.amount} {tip.currency}
                    </div>
                    <div className="text-gray-600 mt-1">{tip.message}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(tip.receivedAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
