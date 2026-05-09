import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "unbabel — daily transmissions from the neighborhood",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,800;1,9..144,400;1,9..144,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="page">{children}</div>
      </body>
    </html>
  );
}
