import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PIXZEN",
  description: "Independent AI Creative Agency",
  icons: {
    icon: [
      {
        url: "/pixzen-icon.png",
        type: "image/png",
        sizes: "48x48",
      },
      {
        url: "/pixzen-icon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    shortcut: "/pixzen-icon.png",
    apple: "/pixzen-icon.png",
  },
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
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,800&display=swap"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}