import ChatComponent from "./components/ChatComponent";
import LandingPage from "./components/LandingPage";
import { fetchAndVectorizeData } from "./api/professors/route";

export default async function Home() {
  await fetchAndVectorizeData();
  return (
    <main className="w-screen min-h-screen mx-auto flex flex-col">
      <LandingPage />
      {/* <ChatComponent /> */}
    </main>
  );
}
