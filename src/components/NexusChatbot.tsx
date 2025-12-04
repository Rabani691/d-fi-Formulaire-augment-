"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

function NexusIcon({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-sky-500 p-[2px] ${className}`}
    >
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-slate-900">
        <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900">
          <span className="text-xs font-semibold tracking-[0.2em] text-emerald-300">
            NX
          </span>
        </div>
      </div>
    </div>
  );
}

export default function NexusChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Salutations, voyageur du Nexus ! 🌐 Je suis l'Assistant IA du Nexus. Comment puis-je t'aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.message) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Réponse invalide");
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Désolé, une erreur s'est produite. Les serveurs du Nexus sont peut-être surchargés. 🔧",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Ouvrir le chatbot"
      >
        {/* Halo animé derrière le bouton */}
        <span className="absolute inset-0 -z-10 h-14 w-14 animate-ping rounded-full bg-emerald-500/30 blur-md" />

        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-950/90 shadow-xl shadow-emerald-500/30 ring-1 ring-emerald-400/60 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:ring-emerald-300">
          <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-emerald-500 via-cyan-500 to-sky-500 opacity-80" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-slate-950">
            {isOpen ? (
              <X size={22} className="text-emerald-200 transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <div className="flex items-center gap-1">
                <NexusIcon className="h-7 w-7" />
                <MessageCircle
                  size={18}
                  className="text-cyan-200 drop-shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </button>

      {/* Fenêtre du chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[90vw] animate-[fadeInUp_0.25s_ease-out]">
          {/* Bordure dégradée */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/70 via-cyan-500/60 to-sky-500/70 p-[1.5px] shadow-2xl shadow-emerald-500/30">
            <div className="flex h-[600px] flex-col overflow-hidden rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-slate-800/70">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-slate-800/80 bg-gradient-to-r from-slate-950/80 via-slate-900/80 to-slate-950/80 px-4 py-3">
                <NexusIcon className="h-10 w-10" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-emerald-100">
                      Assistant Nexus
                    </h3>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                  </div>
                  <p className="text-[11px] text-emerald-100/70">
                    Connecté au réseau quantique du Nexus ⚡
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 px-4 py-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-sm shadow-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-emerald-600 to-cyan-500 text-white shadow-emerald-800/40"
                          : "bg-slate-900/90 text-slate-100 border border-slate-700/70"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                      <p
                        className={`mt-1 text-[10px] ${
                          msg.role === "user"
                            ? "text-emerald-200/80"
                            : "text-slate-500/80"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-3 py-2.5 text-xs text-slate-200">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                      <span>Le Nexus réfléchit pour toi...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-800/80 bg-slate-950/95 px-4 py-3">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Pose ta question au Nexus..."
                    className="flex-1 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 disabled:opacity-60"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-700/50 transition-all hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-slate-500">
                  Astuce : appuie sur <span className="font-semibold">Entrée</span> pour envoyer.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
