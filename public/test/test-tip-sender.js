#!/usr/bin/env node

/**
 * SuperTip Socket Testing Utility
 *
 * This script allows you to send test tip events to your socket server from the command line.
 *
 * Usage:
 *   node test-tip-sender.js <token> [options]
 *
 * Example:
 *   node test-tip-sender.js abc123 --name "John Doe" --amount 100 --currency USD
 *   node test-tip-sender.js abc123 --repeat 5 --delay 3
 */

const { io } = require("socket.io-client");
const readline = require("readline");

// Parse command line arguments
const args = process.argv.slice(2);
let token = args[0];
const options = {};

// Parse options
for (let i = 1; i < args.length; i++) {
  if (args[i].startsWith("--")) {
    const option = args[i].slice(2);
    const value =
      args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true;
    options[option] = value;
    if (value !== true) i++;
  }
}

// Default values
const serverUrl = options.server || "http://localhost:3001";
const repeat = parseInt(options.repeat || 1);
const delay = parseInt(options.delay || 2) * 1000;

// Check for token
if (!token) {
  console.error("Error: Alert token is required");
  console.log("Usage: node test-tip-sender.js <token> [options]");
  console.log("Options:");
  console.log(
    "  --server <url>     Socket server URL (default: http://localhost:3001)"
  );
  console.log("  --name <name>      Donor name (default: Test Donor)");
  console.log("  --amount <amount>  Donation amount (default: 50)");
  console.log("  --currency <code>  Currency code (default: USD)");
  console.log("  --message <text>   Donation message");
  console.log("  --theme <theme>    Alert theme");
  console.log(
    "  --repeat <number>  Number of times to send the tip (default: 1)"
  );
  console.log(
    "  --delay <seconds>  Delay between tips in seconds (default: 2)"
  );
  process.exit(1);
}

// Create readline interface for interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Connect to socket server
console.log(`Connecting to ${serverUrl} with token ${token}...`);
const socket = io(serverUrl, {
  query: { token },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Connection events
socket.on("connect", () => {
  console.log("Connected to socket server!");
  console.log(`Socket ID: ${socket.id}`);
  startSendingTips();
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
  process.exit(1);
});

socket.on("disconnect", (reason) => {
  console.log(`Disconnected: ${reason}`);
  if (reason === "io server disconnect") {
    console.log("Server disconnected the client (likely invalid token)");
    process.exit(1);
  }
});

// Send tip function
function sendTip(index = 1) {
  // Default donation data
  const tipData = {
    name: options.name || "Test Donor",
    amount: options.amount || "50",
    currency: options.currency || "USD",
    message: options.message || `Test donation message #${index}`,
  };

  // Add theme if specified
  if (options.theme) {
    tipData.theme = options.theme;
  }

  // Add sound URL if specified
  if (options.sound) {
    tipData.soundUrl = options.sound;
  }

  console.log(`Sending tip event #${index}:`, tipData);

  // Send with both event names for compatibility
  socket.emit("new_tip", tipData);
  socket.emit("test_tip", tipData);

  return tipData;
}

// Start sending tips
function startSendingTips() {
  let tipCount = 0;

  console.log(
    `Will send ${repeat} tip(s) with ${delay / 1000}s delay between each`
  );

  // Send first tip immediately
  sendTip(++tipCount);

  // Send remaining tips with delay
  if (repeat > 1) {
    const interval = setInterval(() => {
      sendTip(++tipCount);

      if (tipCount >= repeat) {
        clearInterval(interval);
        console.log("All tips sent. Press Ctrl+C to exit or type a command:");
      }
    }, delay);
  } else {
    console.log("Tip sent. Press Ctrl+C to exit or type a command:");
  }

  // Enable interactive mode
  startInteractiveMode();
}

// Interactive mode
function startInteractiveMode() {
  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", (line) => {
    const parts = line.trim().split(" ");
    const command = parts[0].toLowerCase();

    switch (command) {
      case "send":
        // Send another tip
        sendTip();
        break;

      case "custom":
        // Send custom tip
        const customTip = {};
        rl.question("Name? ", (name) => {
          customTip.name = name || "Custom Donor";
          rl.question("Amount? ", (amount) => {
            customTip.amount = amount || "100";
            rl.question("Currency? ", (currency) => {
              customTip.currency = currency || "USD";
              rl.question("Message? ", (message) => {
                customTip.message = message;
                rl.question("Theme? ", (theme) => {
                  if (theme) customTip.theme = theme;

                  console.log("Sending custom tip:", customTip);
                  socket.emit("new_tip", customTip);
                  socket.emit("test_tip", customTip);

                  rl.prompt();
                });
              });
            });
          });
        });
        return; // Don't show prompt yet

      case "exit":
      case "quit":
        console.log("Disconnecting and exiting...");
        socket.disconnect();
        process.exit(0);
        break;

      case "help":
        console.log("Available commands:");
        console.log("  send          Send another tip with default values");
        console.log("  custom        Create and send a custom tip");
        console.log("  exit, quit    Disconnect and exit");
        console.log("  help          Show this help message");
        break;

      default:
        if (line.trim()) {
          console.log('Unknown command. Type "help" for available commands.');
        }
        break;
    }

    rl.prompt();
  });

  rl.on("close", () => {
    console.log("Disconnecting and exiting...");
    socket.disconnect();
    process.exit(0);
  });
}
