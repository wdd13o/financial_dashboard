"use client";

import React, { useEffect, useRef, useState } from "react";

type Message = { id: string; author: "user" | "assistant"; text: string; time: string };

const nowTs = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function Avatar({ author }: { author: "user" | "assistant" }) {
  if (author === "assistant") {
    return (
      <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">FA</div>
    );
  }
  return (
    <div className="w-9 h-9 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-white rounded-full flex items-center justify-center text-sm font-medium">U</div>
  );
}

export default function ChatWidget(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", author: "assistant", text: "Hello — I'm your Finance Assistant. I can help with invoices, revenue insights, and navigation. How can I assist?", time: nowTs() },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: String(Date.now()), author: "user", text: text.trim(), time: nowTs() };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    setTimeout(() => {
      const reply: Message = { id: "r" + Date.now(), author: "assistant", text: generateReply(text), time: nowTs() };
      setMessages((m) => [...m, reply]);
    }, 600);
  };

  const quickActions = [
    "Show recent invoices",
    "How is revenue trending?",
    "Create a new invoice",
  ];

  function generateReply(userText: string) {
    const lower = userText.toLowerCase();
    if (lower.includes("invoice")) return "You can manage invoices under Dashboard → Invoices. I can open a walkthrough or create a sample invoice for you.";
    if (lower.includes("revenue") || lower.includes("chart")) return "Revenue is tracked on the Dashboard. I can summarize recent months or open the chart for you.";
    if (lower.includes("help") || lower.includes("support")) return "I can help with navigation, invoice creation, summaries, and exporting reports. What would you like to do next?";
    return "Thanks — I can help with invoices, customers, and revenue insights. Could you share more details or pick a quick action below?";
  }

  return (
    <div aria-live="polite">
      <div className="fixed right-6 bottom-6 z-50">
        {open ? (
          <div className="w-80 md:w-[420px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden flex flex-col" role="dialog" aria-label="Finance assistant chat">
            <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">FA</div>
                <div>
                  <div className="font-semibold">Finance Assistant</div>
                  <div className="text-xs opacity-80">Professional support — quick answers and guidance</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button aria-label="Minimize chat" onClick={() => setOpen(false)} className="text-white/90 hover:text-white px-2 py-1 rounded-md">Close</button>
              </div>
            </div>

            <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3 max-h-[320px] bg-gradient-to-b from-white to-gray-50 dark:from-slate-800 dark:to-slate-800">
              {messages.map((m) => (
                <div key={m.id} className="flex gap-3 items-start">
                  <div className="flex-shrink-0">
                    <Avatar author={m.author} />
                  </div>
                  <div className="min-w-0">
                    <div className={`px-4 py-2 rounded-lg text-sm leading-snug ${m.author === "assistant" ? "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white" : "bg-blue-600 text-white"}`}>
                      {m.text}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{m.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
              <div className="mb-2 flex gap-2">
                {quickActions.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white hover:bg-gray-200"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="flex gap-2"
              >
                <label htmlFor="chat-input" className="sr-only">Type a message</label>
                <input
                  id="chat-input"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ask about invoices, revenue, or features..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Send</button>
              </form>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-3 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
            aria-label="Open chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H7l-5 3V5z" />
            </svg>
            <span className="hidden sm:inline">Need help?</span>
          </button>
        )}
      </div>
    </div>
  );
}
