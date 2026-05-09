import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "unbabel",
  description: "the neighborhood is talking. hear it out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-gray-900 antialiased" style={{ fontFamily: "'Courier Prime', monospace" }}>
        <div className="min-h-screen">
          <div className="h-1 bg-purple-800" />
          {children}
          <div className="h-1 bg-purple-800 mt-8" />
          <footer className="text-center text-xs text-gray-400 py-4">
            unbabel // nyc 2026
          </footer>
        </div>
      </body>
    </html>
  );
}
