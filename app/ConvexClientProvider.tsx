"use client";

import {
  Authenticated,
  AuthLoading,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import { ReactNode } from "react";
import { ClerkProvider, SignInButton, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Loading } from "@/components/auth/Loading";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading>
          <Loading />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
