import ChatComponent from "./components/ChatComponent";
import LandingPage from "./components/LandingPage";

export default function Home() {
  return (
    <main className="w-screen min-h-screen mx-auto flex flex-col">
      <LandingPage />
      {/* <ChatComponent /> */}
    </main>
  );
}
