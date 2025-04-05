"use client";

import React, { useState, useCallback, useEffect } from "react";
import useSocket from "@/lib/hooks/useSocket";

/**
 * Example Chat Widget component using our centralized socket service
 */
export default function ChatWidget({ userToken }: { userToken: string }) {
  const [messages, setMessages] = useState<
    Array<{ user: string; text: string }>
  >([]);
  const [newMessage, setNewMessage] = useState("");

  // Handle incoming chat messages
  const handleChatMessage = useCallback(
    (data: { user: string; text: string }) => {
      console.log("ChatWidget: Received message:", data);
      setMessages((prev) => [...prev, data]);
    },
    []
  );

  // Use our socket hook with chat_message event handler
  const { isConnected, status, sendEvent, setComponentName } = useSocket(
    {
      chat_message: handleChatMessage,
    },
    userToken
  );

  // Set component name for better logging
  useEffect(() => {
    setComponentName("ChatWidget");
  }, [setComponentName]);

  // Send a new message
  const sendMessage = useCallback(() => {
    if (newMessage.trim() && isConnected) {
      console.log("ChatWidget: Sending message:", newMessage);
      // Send message to server
      sendEvent("chat_message", { text: newMessage });
      // Add to local messages (optimistic update)
      setMessages((prev) => [...prev, { user: "You", text: newMessage }]);
      setNewMessage("");
    }
  }, [newMessage, isConnected, sendEvent]);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden w-full h-[400px]">
      {/* Header */}
      <div className="bg-indigo-600 text-white py-3 px-4 flex justify-between items-center">
        <h3 className="font-semibold">Chat</h3>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-400" : "bg-red-400"
            }`}
          ></span>
          <span className="text-xs">{status}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 p-4">No messages yet</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-[80%] ${
                msg.user === "You"
                  ? "bg-indigo-100 text-indigo-800 self-end ml-auto"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div className="font-semibold text-xs">{msg.user}</div>
              <div>{msg.text}</div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !newMessage.trim()}
          className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
