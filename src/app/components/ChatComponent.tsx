"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { RiSendPlaneLine } from "react-icons/ri";
import SiteLogo from "../../../public/logos/site-logo.webp";

export default function ChatComponent() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi, I'm the UniComp AI support assistant.  How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const { data: session } = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    setMessage("");
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);

    try {
      console.log("Sending request to /api/chat");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      console.log("Response Status: ", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "" },
      ]);

      let accumulatedContent = "";
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1].content = accumulatedContent;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error in send message", error);
      setError(
        `Something went wrong: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full md:max-w-[80rem] md:min-w-[80rem] min-h-screen flex flex-col items-center pt-28 md:pt-32 md:pb-28 md:px-24 mx-auto bg-white text-neutral-950">
      <div className="flex flex-col md:w-[60rem] h-full">
        <div className="flex flex-col gap-2 overflow-auto bg-white px-4 md:px-12">
          {messages &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex py-6 justify-${message.role} === 'assistant' ? 'flex-start' : 'flex-end`}
              >
                {message.role === "assistant" ? (
                  <Image
                    src={SiteLogo}
                    alt="unicomp ai"
                    width={44}
                    height={44}
                    className="bg-white rounded-xl md:rounded-full p-1 mr-2 md:mr-4 min-h-12 max-h-12 min-w-12 max-w-12"
                  />
                ) : (
                  <Image
                    src={session?.user?.image as string}
                    alt={session?.user?.name as string}
                    width={44}
                    height={44}
                    className="bg-white rounded-full p-1 mr-4 min-h-12 max-h-12 min-w-12 max-w-12"
                  />
                )}
                <div
                  className={`py-2 px-2 md:px-4 rounded-xl md:rounded-3xl w-full md:max-w-[90%] ${
                    message.role === "assistant"
                      ? "bg-neutral-200 text-neutral-950 md:px-4"
                      : "bg-[#e5f4ff] md:px-4"
                  }`}
                >
                  <ReactMarkdown className="text-xs md:text-lg w-full">
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex bg-white gap-2 fixed bottom-14 md:bottom-9 left-[50.5%] translate-x-[-50.5%] right-0 w-[70rem]"
        >
          <div className="w-full mx-auto flex flex-col items-center">
            <div className="w-[26%] md:w-[80%] ml-2 md:ml-0 py-1 md:py-2 flex items-center border-2 rounded-xl md:rounded-full bg-blue-100/50">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-blue-100/20 py-1 px-2 ml-4 outline-none placeholder:text-neutral-600"
                placeholder="Enter your prompt here"
              />
              <button
                type="submit"
                className="block hover:bg-neutral-200 p-4 mr-2 rounded-full transition duration-200"
              >
                <RiSendPlaneLine
                  size={28}
                  color="gray"
                  className="w-5 h-5 md:w-7 md:h-7"
                />
              </button>
            </div>
          </div>
        </form>
        {isLoading && (
          <div className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-200 opacity-80 rounded-full p-2 shadow-md">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900"></div>
            </div>
          </div>
        )}
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </div>
    </main>
  );
}
