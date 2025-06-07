import type { Metadata } from "next";
import { headers } from "next/headers";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import RainbowKitProvider from "@/context/RainbowKitProvider";
import { KeplrProvider } from "@/context/KeplrProvider";
import ApolloProvider from "@/context/ApolloProvider";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Keplr Jeju Ideathon",
  description: "Initia Delegation Verifier",
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
        <RainbowKitProvider cookies={cookies}>
          <KeplrProvider>
            <ApolloProvider>{children}</ApolloProvider>
          </KeplrProvider>
        </RainbowKitProvider>
      </body>
    </html>
  );
}
