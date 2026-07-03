"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  chatQuickReplies,
  getBotResponse,
  getQuickReplyResponse,
  type ChatMessage,
} from "@/lib/chatbot";
import { COKOLADNI_AGENT_GPT_URL } from "@/lib/cokoladni-agent";
import { site } from "@/lib/content";

const THREAD_KEY = "cokoladni-agent-thread";

function createMessage(
  role: ChatMessage["role"],
  data: Omit<ChatMessage, "id" | "role">
): ChatMessage {
  return { id: crypto.randomUUID(), role, ...data };
}

function formatText(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={j} className="font-semibold text-text-primary">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      })}
      {i < text.split("\n").length - 1 && <br />}
    </span>
  ));
}

function isExternalHref(href: string) {
  return href.startsWith("http");
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("bot", getQuickReplyResponse("greeting")),
  ]);
  const [typing, setTyping] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [threadId, setThreadId] = useState<string | undefined>();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(THREAD_KEY);
    if (stored) setThreadId(stored);

    fetch("/api/chat")
      .then((r) => r.json())
      .then((data) => setAiConfigured(Boolean(data.configured)))
      .catch(() => setAiConfigured(false));
  }, []);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, typing]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendToAgent = useCallback(
    async (userText: string) => {
      setTyping(true);

      const userMsg = createMessage("user", { text: userText });
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");

      const apiMessages = history
        .filter((m) => m.role === "user" || m.role === "bot")
        .map((m) => ({
          role: (m.role === "bot" ? "assistant" : "user") as
            | "user"
            | "assistant",
          content: m.text,
        }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            message: userText,
            threadId,
          }),
        });

        const data = (await res.json()) as {
          message: string;
          links?: { label: string; href: string }[];
          threadId?: string;
          fallback?: boolean;
        };

        if (data.threadId) {
          setThreadId(data.threadId);
          sessionStorage.setItem(THREAD_KEY, data.threadId);
        }

        setMessages((prev) => [
          ...prev,
          createMessage("bot", {
            text: data.message,
            links: data.links,
          }),
        ]);
      } catch {
        const fallback = getBotResponse(userText);
        setMessages((prev) => [...prev, createMessage("bot", fallback)]);
      } finally {
        setTyping(false);
      }
    },
    [messages, threadId]
  );

  const handleQuickReply = (id: string, label: string) => {
    if (aiConfigured) {
      sendToAgent(label);
      return;
    }
    setMessages((prev) => [...prev, createMessage("user", { text: label })]);
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        createMessage("bot", getQuickReplyResponse(id)),
      ]);
      setTyping(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing) return;
    sendToAgent(text);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-5 z-[60] flex w-[min(100vw-2.5rem,380px)] flex-col overflow-hidden rounded-2xl border border-accent/25 bg-[#05070d]/95 shadow-[0_0_60px_rgba(101,227,255,0.15)] backdrop-blur-xl sm:right-8"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <Image
                src="/images/logo.png"
                alt={site.name}
                width={36}
                height={36}
                className="logo-neon h-9 w-9 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  ČOKOLADNI AGENT
                </p>
                <p className="text-xs text-accent">
                  {aiConfigured ? "AI · powered by OpenAI" : "Brzi odgovori · lokalni režim"}
                </p>
              </div>
              <a
                href={COKOLADNI_AGENT_GPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-lg border border-accent/25 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-accent transition hover:bg-accent/10 sm:inline-block"
                title="Otvori punu verziju u ChatGPT"
              >
                ChatGPT
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Zatvori chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div
              ref={listRef}
              className="flex max-h-[min(50vh,360px)] flex-col gap-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent/20 text-text-primary"
                        : "glass text-text-muted"
                    }`}
                  >
                    {formatText(msg.text)}
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {msg.links.map((link) =>
                          isExternalHref(link.href) ? (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition hover:bg-accent/20"
                            >
                              {link.label}
                            </a>
                          ) : (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setOpen(false)}
                              className="inline-block rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition hover:bg-accent/20"
                            >
                              {link.label}
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="glass flex gap-1 rounded-2xl px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-accent/60"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 px-3 py-2.5">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {chatQuickReplies.map((qr) => (
                  <button
                    key={qr.id}
                    type="button"
                    onClick={() => handleQuickReply(qr.id, qr.label)}
                    disabled={typing}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-text-muted transition hover:border-accent/30 hover:text-accent disabled:opacity-50"
                  >
                    {qr.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pitaj ČOKOLADNI AGENT-a..."
                  disabled={typing}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-dim outline-none transition focus:border-accent/40 focus:ring-1 focus:ring-accent/20 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  className="btn-premium flex h-10 w-10 shrink-0 items-center justify-center rounded-xl disabled:opacity-40"
                  aria-label="Pošalji"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-[#05070d]/90 shadow-[0_0_40px_rgba(101,227,255,0.25)] backdrop-blur-xl transition hover:shadow-[0_0_50px_rgba(101,227,255,0.4)] sm:right-8"
        aria-label={open ? "Zatvori chat" : "Otvori ČOKOLADNI AGENT chat"}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.svg
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-accent"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-accent"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.695 16.18 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
