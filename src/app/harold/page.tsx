"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneHeader from "@/components/PhoneHeader";
import MascotImage from "@/components/MascotImage";

interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

const STORAGE_KEY = "harold_user_id";

/** Generate or fetch a stable per-browser user id (used until real auth lands). */
function useUserId(): string | null {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      stored = crypto.randomUUID();
      window.localStorage.setItem(STORAGE_KEY, stored);
    }
    setId(stored);
  }, []);
  return id;
}

/** Render *single asterisk* keywords as amber-highlighted spans. */
function renderHighlighted(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <span
          key={i}
          style={{ color: "var(--amber)", fontWeight: 600 }}
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const SUGGESTIONS = [
  "I feel a bit off today.",
  "What should I do this morning?",
  "Help me wind down tonight.",
];

export default function HaroldChatPage() {
  const userId = useUserId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Fetch the last 20 messages on mount. */
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      setHistoryLoading(true);
      try {
        const res = await fetch(
          `/api/coach/conversations?user_id=${encodeURIComponent(userId)}&limit=20`,
        );
        if (res.ok) {
          const json = await res.json();
          if (!cancelled) setMessages(json.messages ?? []);
        } else if (res.status !== 503) {
          const json = await res.json().catch(() => ({}));
          if (!cancelled) setError(json.error ?? "Could not load history");
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Network error");
      } finally {
        if (!cancelled) setHistoryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* Auto-scroll to the latest message. */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      if (!userId || !text.trim() || loading) return;
      setError(null);
      setLoading(true);
      const userMsg: Message = { role: "user", content: text.trim() };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      try {
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "content-type": "application/json", "x-user-id": userId },
          body: JSON.stringify({ user_id: userId, message: text.trim() }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error ?? "Coach request failed");
          return;
        }
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: json.reply },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network error");
      } finally {
        setLoading(false);
      }
    },
    [userId, loading],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const clearHistory = useCallback(async () => {
    if (!userId) return;
    if (!confirm("Clear your full chat history with Harold?")) return;
    try {
      await fetch(
        `/api/coach/conversations?user_id=${encodeURIComponent(userId)}`,
        { method: "DELETE", headers: { "x-user-id": userId } },
      );
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    }
  }, [userId]);

  const showSuggestions = useMemo(
    () => !historyLoading && messages.length === 0,
    [historyLoading, messages.length],
  );

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ background: "var(--gradient-page)" }}
    >
      <PhoneHeader
        right={
          messages.length > 0 ? (
            <button
              onClick={clearHistory}
              className="text-xs"
              style={{ color: "var(--muted-soft)" }}
            >
              Clear
            </button>
          ) : undefined
        }
      />

      <div
        ref={scrollRef}
        className="flex-1 px-5 pb-4 overflow-y-auto space-y-3"
      >
        {historyLoading && (
          <p
            className="text-center text-sm py-10"
            style={{ color: "var(--muted-soft)" }}
          >
            Loading your conversation…
          </p>
        )}

        {showSuggestions && <Welcome />}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={m.id ?? `${m.role}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"
                }`}
                style={
                  m.role === "user"
                    ? { background: "#3D3529", color: "#F5F0E8" }
                    : {
                        background: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(180,165,140,0.25)",
                        color: "#2C2418",
                      }
                }
              >
                {renderHighlighted(m.content)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(180,165,140,0.25)",
                color: "var(--muted)",
              }}
            >
              <span className="inline-flex gap-1">
                <Dot delay={0} />
                <Dot delay={0.15} />
                <Dot delay={0.3} />
              </span>
            </div>
          </div>
        )}

        {error && (
          <div
            className="text-xs px-3 py-2 rounded-lg"
            style={{
              background: "rgba(217,139,122,0.15)",
              border: "1px solid rgba(217,139,122,0.35)",
              color: "#8B3A2C",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {showSuggestions && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => void send(s)}
              className="text-xs px-3 py-2 rounded-full"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(180,165,140,0.3)",
                color: "var(--muted-deep)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-5 pb-6 pt-2"
        style={{
          background:
            "linear-gradient(180deg, rgba(245,240,232,0) 0%, rgba(245,240,232,0.95) 40%)",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell Harold what's on your mind…"
          className="flex-1 px-4 py-3 rounded-full text-sm"
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(180,165,140,0.3)",
            color: "var(--foreground)",
          }}
          disabled={!userId || loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading || !userId}
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: input.trim() ? "#3D3529" : "rgba(61,53,41,0.3)",
            color: "#F5F0E8",
            cursor: input.trim() ? "pointer" : "not-allowed",
          }}
          aria-label="Send"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1, repeat: Infinity, delay }}
      className="w-1.5 h-1.5 rounded-full"
      style={{ background: "var(--muted)" }}
    />
  );
}

function Welcome() {
  return (
    <div className="text-center py-8 px-4">
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mx-auto mb-4 inline-block"
      >
        <MascotImage
          name="harold-happy"
          alt="Harold"
          width={96}
          height={96}
          className="mascot-img"
          style={{ filter: "drop-shadow(0 12px 24px rgba(100,80,60,0.25))" }}
        />
      </motion.div>
      <h1
        className="mb-2"
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontStyle: "italic",
          fontWeight: 600,
          color: "#2C2418",
          fontSize: "1.6rem",
        }}
      >
        Hi, I&rsquo;m Harold.
      </h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Tell me how the day&rsquo;s feeling and I&rsquo;ll help you find the
        smallest next step.
      </p>
    </div>
  );
}
