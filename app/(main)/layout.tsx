import { ChatButton } from "@/components/app/chat/ChatButton";
import { ChatSheet } from "@/components/app/chat/ChatSheet";
import { AppHeader } from "@/components/app/layout/AppHeader";
import { AppShell } from "@/components/app/layout/AppShell";
import { OnboardingGuard } from "@/components/app/onboarding/OnboardingGuard";
import { ChatStoreProvider } from "@/lib/store/chat-store-provider";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ChatStoreProvider>
        <AppShell>
          <OnboardingGuard>
            <AppHeader />
            {children}
          </OnboardingGuard>
        </AppShell>
        <ChatButton />
        <ChatSheet />
        <SanityLive />
      </ChatStoreProvider>
    </ClerkProvider>
  );
}
