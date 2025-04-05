import React from "react";
import "../globals.css"; // Import global styles if needed, but be mindful of background styles

export default function AlertLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Crucially, no background colors set here by default
    // The page itself will control its appearance
    // Ensure html/body in globals.css don't force a background for these routes
    <html lang="en">
      <body
        style={{
          background: "transparent",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  );
}
