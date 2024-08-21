"use client";

import { useState, useRef, useEffect } from "react";

import { RiSendPlaneLine } from "react-icons/ri";

export default function ChatComponent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I'm the RMP support assistant.  How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [message]);

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
        <div className="flex flex-col gap-2 flex-grow-1 overflow-auto h-screen bg-white px-12">
          {messages &&
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex py-6 justify-${message.role} === 'assistant' ? 'flex-start' : 'flex-end`}
              >
                <div
                  className={`py-2 rounded-2xl ${
                    message.role === "assistant"
                      ? "bg-[#e5f4ff] px-4"
                      : "bg-teal-300/30 px-4"
                  }`}
                >
                  <p className="text-black font-normal text-lg">
                    {message.content}
                  </p>
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
            <div className="relative w-full flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full min-h-[4.7rem] border border-neutral-100 shadow-md shadow-neutral-200 bg-blue-50/40 p-6 rounded-full outline-none placeholder:text-neutral-600"
                placeholder="Enter your prompt here"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                className="absolute right-10 bottom-6"
              >
                <RiSendPlaneLine size={24} color="gray" />
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
