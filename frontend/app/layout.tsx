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
  title: "OrbitChronicle - Loyalty Across The Cosmos",
  description:
    "Revolutionary cross-chain loyalty system connecting Cosmos and EVM ecosystems. Earn exclusive NFTs, accumulate loyalty points, and unlock rewards across the blockchain universe.",
  keywords: [
    "blockchain",
    "loyalty",
    "cosmos",
    "ethereum",
    "chainlink",
    "nft",
    "defi",
    "rewards",
  ],
  creator: "OrbitChronicle",
  publisher: "OrbitChronicle",
  openGraph: {
    title: "OrbitChronicle - Loyalty Across The Cosmos",
    description:
      "Revolutionary cross-chain loyalty system connecting Cosmos and EVM ecosystems.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OrbitChronicle - Loyalty Across The Cosmos",
    description:
      "Revolutionary cross-chain loyalty system connecting Cosmos and EVM ecosystems.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.svg",
    shortcut: "/favicon.svg",
  },
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
        className={`${orbitron.variable} ${jetBrainsMono.variable} font-orbitron antialiased bg-slate-950 text-white`}
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
