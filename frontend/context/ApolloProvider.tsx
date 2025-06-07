"use client";

import { ApolloProvider as ApolloProviderBase } from "@apollo/client";
import { apolloClient } from "@/lib/apollo";
import { useEffect, useState } from "react";

export default function ApolloProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ApolloProviderBase client={apolloClient}>{children}</ApolloProviderBase>
  );
}
