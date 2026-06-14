"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, User, Bot, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { UIMessage } from "ai";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBounced, setHasBounced] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, regenerate, status, error, clearError } = useChat();

  const isLoading = status === "streaming" || status === "submitted";

  // Stop bounce animation after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setHasBounced(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue("");
    await sendMessage({ text });
  };

  const handleQuickAction = async (text: string) => {
    if (isLoading) return;
    setInputValue("");
    await sendMessage({ text });
  };

  // Extract text content from a message's parts
  const getTextContent = (m: UIMessage): string => {
    return m.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");
  };

  // Extract tool parts from a message
  const getToolParts = (m: UIMessage) => {
    return m.parts.filter((p) => p.type.startsWith("tool-"));
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center z-50 cursor-pointer border-none transition-all duration-300 hover:scale-110 hover:shadow-2xl ${hasBounced ? "animate-bounce" : ""}`}
          style={{
            background: "linear-gradient(135deg, #7C3AED 0%, #a855f7 50%, #F472B6 100%)",
            color: "white",
          }}
          aria-label="Open chat"
        >
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 sm:w-96 w-[calc(100vw-3rem)]"
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          <Card
            className="h-[520px] shadow-2xl flex flex-col overflow-hidden border-0"
            style={{
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "1.25rem",
              border: "1px solid rgba(124, 58, 237, 0.15)",
            }}
          >
            {/* Header */}
            <CardHeader
              className="py-4 px-5 flex flex-row items-center justify-between shadow-sm"
              style={{
                background: "linear-gradient(135deg, #7C3AED 0%, #9333ea 50%, #a855f7 100%)",
                borderRadius: "1.25rem 1.25rem 0 0",
              }}
            >
              <CardTitle className="text-lg font-bold flex items-center gap-2 m-0 p-0 text-white">
                <Bot className="w-5 h-5 text-purple-200" />
                Ask About Manu
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/20 text-white h-8 w-8 !mt-0 cursor-pointer rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>

            {/* Messages */}
            <CardContent
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
              style={{ background: "linear-gradient(180deg, #faf5ff 0%, #fff8f0 100%)" }}
            >
              {messages.length === 0 ? (
                <div className="text-center text-purple-400 mt-8 text-sm px-4">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #f3e8ff, #ffe4e6)" }}
                  >
                    <Bot className="w-8 h-8 text-purple-500" />
                  </div>
                  <p className="font-semibold text-purple-600 mb-1">Hi there! 👋🎨</p>
                  <p className="text-purple-400">
                    I know all about Manu&apos;s art adventures! Ask me anything about her drawings, or send a message.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {["Who is Manu?", "Tell me about her art", "Send a message"].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleQuickAction(q)}
                        className="text-xs px-3 py-1.5 rounded-full border border-purple-200 text-purple-600 hover:bg-purple-100 transition-colors cursor-pointer bg-white/80"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    style={{ animation: "fadeIn 0.25s ease-out" }}
                  >
                    <div className={`flex gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          m.role === "user" ? "bg-purple-200 text-purple-700" : "text-pink-600"
                        }`}
                        style={m.role === "assistant" ? { background: "linear-gradient(135deg, #fce7f3, #f3e8ff)" } : {}}
                      >
                        {m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>

                      {/* Bubble */}
                      <div className="flex flex-col gap-1.5">
                        {/* Tool invocation indicators */}
                        {m.role === "assistant" && getToolParts(m).length > 0 && (
                          <div className="flex flex-col gap-1">
                            {getToolParts(m).map((part, idx) => {
                              const toolPart = part as { type: string; state: string; toolCallId: string };
                              const isDone = toolPart.state === "output-available";
                              return (
                                <div
                                  key={toolPart.toolCallId || idx}
                                  className={`flex items-center gap-1.5 text-xs italic px-3 py-1.5 rounded-xl ${
                                    isDone
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                      : "bg-pink-50 text-pink-500 border border-pink-200"
                                  }`}
                                >
                                  {isDone ? (
                                    <>✓ Message delivered! 💌</>
                                  ) : (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin" /> Sending...
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Text content */}
                        {getTextContent(m) && (
                          <div
                            className={`p-3 rounded-2xl text-sm leading-relaxed ${
                              m.role === "user"
                                ? "text-white rounded-tr-sm shadow-md"
                                : "text-purple-900 border border-purple-100/60 rounded-tl-sm shadow-sm"
                            }`}
                            style={
                              m.role === "user"
                                ? { background: "linear-gradient(135deg, #7C3AED, #9333ea)" }
                                : { background: "rgba(255,255,255,0.85)" }
                            }
                          >
                            <p className="whitespace-pre-wrap m-0">{getTextContent(m)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start" style={{ animation: "fadeIn 0.2s ease-out" }}>
                  <div className="bg-white/85 px-4 py-2.5 rounded-2xl border border-purple-100/60 shadow-sm flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="flex justify-center" style={{ animation: "fadeIn 0.2s ease-out" }}>
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-center text-sm max-w-[85%]">
                    <p className="text-red-600 font-medium mb-2">Oops! Something went wrong 😅</p>
                    <Button
                      onClick={() => {
                        clearError();
                        regenerate();
                      }}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-100 cursor-pointer gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input */}
            <CardFooter
              className="p-3 border-t border-purple-100/40 rounded-b-xl border-x-0 border-b-0"
              style={{ background: "rgba(255,255,255,0.95)" }}
            >
              <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                <Input
                  id="chat-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about Manu's art..."
                  className="flex-1 border-purple-200/60 focus-visible:ring-purple-400 bg-white/80 rounded-xl"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !inputValue.trim()}
                  className="shrink-0 cursor-pointer rounded-xl text-white disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #9333ea)" }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
