import type { Metadata } from "next";

// Self-hosted via @fontsource — avoids a build-time fetch to Google Fonts
// and keeps the app fully functional in offline/restricted-network setups.
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "FAIRREPLAY — Decision Integrity Engine",
  description:
    "Judge the decision, not the outcome. FAIRREPLAY freezes a system at decision time T and evaluates the available choices using only information that existed then — first in F1, then applied to EV fleet energy coordination.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
