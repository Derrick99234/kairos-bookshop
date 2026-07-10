import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Kairos Bookshop | Find Your Next Transformation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="text-on-background antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        <Providers>
          <PageShell>{children}</PageShell>
        </Providers>
        </body>
    </html>
  );
}
