import { Metadata } from "next";

import LandingPage from "./components/LandingPage";

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

export default async function Home() {
  return (
    <main className="w-screen min-h-screen mx-auto flex flex-col">
      <LandingPage />
    </main>
  );
}
