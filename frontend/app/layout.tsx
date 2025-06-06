import type { Metadata } from "next";
import { headers } from "next/headers";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ReownProvider from "@/context/ReownProvider";
import { KeplrProvider } from "@/context/KeplrProvider";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Initia Delegation Verifier",
  description: "Initia 블록체인 delegation을 검증하는 dApp with Reown AppKit",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <ReownProvider cookies={cookies}>
          <KeplrProvider>{children}</KeplrProvider>
        </ReownProvider>
      </body>
    </html>
  );
}
