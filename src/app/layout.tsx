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
          <header className="bg-purple-800 px-4 py-2">
            <a href="/" className="inline-block">
              <svg viewBox="0 0 120 32" width="120" height="32">
                <polygon points="12,2 20,2 21,28 11,28" fill="#fff"/>
                <line x1="16" y1="2" x2="16" y2="0" stroke="#fff" strokeWidth="1.5"/>
                <rect x="14" y="1" width="4" height="2" fill="#fff"/>
                <rect x="10" y="26" width="12" height="3" fill="#fff"/>
                <line x1="12" y1="8" x2="20" y2="8" stroke="#5f2580" strokeWidth="1"/>
                <line x1="12" y1="14" x2="20" y2="14" stroke="#5f2580" strokeWidth="1"/>
                <line x1="11" y1="20" x2="21" y2="20" stroke="#5f2580" strokeWidth="1"/>
                <text x="28" y="20" fontFamily="Georgia, serif" fontSize="16" fill="#fff" fontWeight="bold">unbabel</text>
              </svg>
            </a>
          </header>
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
