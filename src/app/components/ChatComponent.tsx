"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { RiSendPlaneLine } from "react-icons/ri";
import SiteLogo from "../../../public/logos/site-logo.webp";
export default function ChatComponent() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm the RMP support assistant.  How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res?.body?.getReader();
      const decoder = new TextDecoder();
      let result = "";

      return reader
        ?.read()
        .then(function processText({
          done,
          value,
        }: ReadableStreamReadResult<Uint8Array>): any {
          if (done) {
            return result;
          }
          const text = decoder.decode(value || new Uint8Array(), {
            stream: true,
          });
          setMessages((messages) => {
            let lastMessage = messages[messages.length - 1];
            let otherMessages = messages.slice(0, messages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + text },
            ];
          });
          return reader.read().then(processText);
        });
    });
  };

  return (
    <main className="max-w-[80rem] min-w-[80rem] min-h-screen flex flex-col justify-center items-center px-24 pt-24 mx-auto bg-white text-neutral-950">
      <div className="flex flex-col w-[60rem] h-full">
        <div className="flex flex-col gap-2 overflow-auto h-screen bg-white px-12">
          {messages &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex py-6 justify-${message.role} === 'assistant' ? 'flex-start' : 'flex-end`}
              >
                {message.role === "assistant" ? (
                  <Image
                    src={SiteLogo}
                    alt="RMP"
                    width={44}
                    height={44}
                    className="bg-white rounded-full p-1 mr-4 border border-neutral-500 min-h-12 max-h-12 min-w-12 max-w-12"
                  />
                ) : (
                  <Image
                    src={session?.user?.image as string}
                    alt={session?.user?.name as string}
                    width={44}
                    height={44}
                    className="bg-white rounded-full p-1 mr-4 border border-neutral-500 min-h-12 max-h-12 min-w-12 max-w-12"
                  />
                )}
                <div
                  className={`py-2 px-4 rounded-3xl ${
                    message.role === "assistant"
                      ? "bg-neutral-200 text-neutral-950 px-4"
                      : "bg-[#e5f4ff] px-4"
                  }`}
                >
                  <div className="text-lg flex items-center gap-4">
                    <p>{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex bg-white gap-2 fixed bottom-0 left-[50.5%] translate-x-[-50.5%] right-0 w-[70rem]"
        >
          <div className="w-full flex flex-col items-center">
            <div className="w-[80%] py-2 flex items-center border-2 rounded-full bg-blue-100/50">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-blue-100/20 py-1 px-2 ml-4 outline-none placeholder:text-neutral-600"
                placeholder="Enter your prompt here"
              />
              <button
                // onClick={sendMessage}
                className="hover:bg-neutral-200 p-4 mr-2 rounded-full transition duration-200"
              >
                <RiSendPlaneLine size={28} color="gray" />
              </button>
            </div>
            <p className="text-black text-sm my-2">
              Powered by OpenAI | &copy; 2024 All Rights Reserved fakenamedev
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
