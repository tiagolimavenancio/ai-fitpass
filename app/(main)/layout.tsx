import { AppHeader } from "@/components/app/layout/AppHeader";
import { OnboardingGuard } from "@/components/app/onboarding/OnboardingGuard";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <OnboardingGuard>
        <AppHeader />
        {children}
      </OnboardingGuard>
      <SanityLive />
    </ClerkProvider>
  );
}
