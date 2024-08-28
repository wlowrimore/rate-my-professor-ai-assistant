import type { Metadata } from "next";
import { Montserrat as Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./providers/SessionProvider";
import Header from "./components/Header.";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "UniComp AI",
  description: "AI powered professor rating and review platform",
  keywords: ["AI", "professor", "rating", "review"],
  openGraph: {
    title: "UniComp AI",
    description: "AI powered professor rating and review platform",
    url: "https://unicomp-ai.vercel.app/search-ai",
    siteName: "UniComp AI",
    images: [
      {
        url: "https://raw.githubusercontent.com/wlowrimore/rate-my-professor-ai-assistant/main/public/screenshots/home.webp",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en" className="bg-white">
        <body className={inter.className}>
          <main className="flex flex-col items-center mt-6">
            <Header />
            {children}
            <Footer />
          </main>
        </body>
      </html>
    </SessionWrapper>
  );
}
