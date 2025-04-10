"use client";

import React, { useState, useCallback } from "react";

/**
 * Chat Widget component (Static version without socket)
 */
export default function ChatWidget({ userToken }: { userToken: string }) {
  const [messages, setMessages] = useState<
    Array<{ user: string; text: string }>
  >([
    { user: "System", text: "Welcome to the chat!" },
    {
      user: "System",
      text: "This is a static implementation (socket removed)",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // Send a new message (static implementation)
  const sendMessage = useCallback(() => {
    if (newMessage.trim()) {
      // Add to local messages
      setMessages((prev) => [...prev, { user: "You", text: newMessage }]);
      setNewMessage("");

      // Simulate a response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            user: "System",
            text: "This is a static response. Socket functionality has been removed.",
          },
        ]);
      }, 1000);
    }
  }, [newMessage]);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden w-full h-[400px]">
      {/* Header */}
      <div className="bg-indigo-600 text-white py-3 px-4 flex justify-between items-center">
        <h3 className="font-semibold">Chat</h3>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-400"></span>
          <span className="text-xs">Static Mode</span>
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
        />
        <button
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
