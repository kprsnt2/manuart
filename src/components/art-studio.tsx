"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Star, Lightbulb, Loader2, Wand2 } from "lucide-react";

const AI_ACTIONS = [
    { id: "story", label: "Write a Story", emoji: "📖", icon: BookOpen, description: "Turn this drawing into a magical story!" },
    { id: "critique", label: "Art Review", emoji: "⭐", icon: Star, description: "Get a fun, encouraging art review!" },
    { id: "suggest", label: "What to Draw Next", emoji: "💡", icon: Lightbulb, description: "Get inspired with new drawing ideas!" },
];

interface Drawing {
    src: string;
    filename: string;
    dateFormatted: string;
}

export default function ArtStudio({ drawings = [] }: { drawings?: Drawing[] }) {
    const [description, setDescription] = useState("");
    const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeAction, setActiveAction] = useState("");

    const handleAction = async (action: string) => {
        if (!description.trim() && !selectedDrawing) return;
        setLoading(true);
        setActiveAction(action);
        setResult("");

        try {
            const res = await fetch("/api/analyze-art", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    drawingDescription: description, 
                    drawingPath: selectedDrawing?.src,
                    action 
                }),
            });

            if (!res.ok) throw new Error("Failed to get AI response");

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let fullText = "";

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    // Parse SSE data chunks
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('0:')) {
                            try {
                                const text = JSON.parse(line.slice(2));
                                fullText += text;
                                setResult(fullText);
                            } catch {
                                // skip non-text chunks
                            }
                        }
                    }
                }
            }
        } catch (error) {
            setResult("Oops! Something went wrong. Please try again! 😅");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen px-6 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="text-5xl mb-4">🪄</div>
                    <h1 className="text-4xl font-bold tracking-tight text-purple-800 mb-4">
                        AI Art Studio
                    </h1>
                    <p className="text-xl text-purple-400 max-w-2xl mx-auto">
                        Select one of Manu&apos;s drawings, or describe it, and let AI create magic — stories, reviews, and inspiration! ✨
                    </p>
                </div>

                {/* Drawing Selector */}
                {drawings.length > 0 && (
                    <div className="mb-8 bg-white p-6 rounded-2xl border border-purple-100 shadow-md">
                        <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                            🎨 Select one of Manu&apos;s Drawings to Analyze
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-purple-200">
                            {drawings.map((dw) => {
                                const isSelected = selectedDrawing?.src === dw.src;
                                return (
                                    <button
                                        key={dw.src}
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedDrawing(null);
                                            } else {
                                                setSelectedDrawing(dw);
                                                if (!description) {
                                                    const cleanName = dw.filename
                                                        .replace(/^\d+[-_]?/, '')
                                                        .replace(/\.[^/.]+$/, '')
                                                        .replace(/[-_]/g, ' ');
                                                    setDescription(`A beautiful drawing of ${cleanName}`);
                                                }
                                            }
                                        }}
                                        className={`flex-shrink-0 relative rounded-xl overflow-hidden border-3 transition-all cursor-pointer ${
                                            isSelected 
                                                ? "border-purple-600 scale-95 shadow-md" 
                                                : "border-transparent hover:border-purple-200"
                                        }`}
                                    >
                                        <img src={dw.src} alt={dw.filename} className="w-24 h-24 object-cover" />
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                                                <span className="bg-purple-600 text-white rounded-full p-1 text-xs">✓</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {selectedDrawing && (
                            <div className="mt-3 text-sm text-purple-500 flex items-center gap-2">
                                <span>Selected: <strong>{selectedDrawing.filename}</strong></span>
                                <button 
                                    onClick={() => {
                                        setSelectedDrawing(null);
                                        setDescription("");
                                    }}
                                    className="text-red-500 hover:underline text-xs cursor-pointer"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Input Section */}
                <Card className="bg-white border-purple-100 shadow-md mb-8">
                    <CardHeader>
                        <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-purple-500" />
                            Describe the Drawing
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe Manu's drawing here... e.g., 'A colorful butterfly with purple and pink wings flying over a garden of sunflowers with a bright sun in the sky'"
                            className="w-full min-h-[120px] p-4 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-purple-50/30 text-purple-900 placeholder:text-purple-300 resize-none outline-none"
                        />
                        <div className="flex flex-wrap gap-3 mt-4">
                            {AI_ACTIONS.map((action) => (
                                <Button
                                    key={action.id}
                                    onClick={() => handleAction(action.id)}
                                    disabled={loading || !description.trim()}
                                    className="gap-2 rounded-xl cursor-pointer"
                                    style={{
                                        background: loading && activeAction === action.id
                                            ? "#9333ea"
                                            : "linear-gradient(135deg, #7C3AED, #9333ea)",
                                    }}
                                >
                                    {loading && activeAction === action.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <action.icon className="w-4 h-4" />
                                    )}
                                    {action.emoji} {action.label}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Result Section */}
                {result && (
                    <Card className="bg-white border-purple-100 shadow-md" style={{ animation: "fadeIn 0.3s ease-out" }}>
                        <CardHeader>
                            <CardTitle className="text-xl text-purple-800 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-yellow-500" />
                                {AI_ACTIONS.find(a => a.id === activeAction)?.label || "AI Response"}
                                <Badge className="bg-purple-100 text-purple-700 text-xs">AI Generated</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-purple max-w-none">
                                <p className="text-purple-800 leading-relaxed whitespace-pre-wrap">{result}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
                    {AI_ACTIONS.map((action) => (
                        <Card key={action.id} className="card-bounce bg-white border-purple-100 shadow-sm">
                            <CardContent className="pt-6 pb-4 text-center">
                                <div className="text-4xl mb-2">{action.emoji}</div>
                                <p className="font-bold text-purple-700">{action.label}</p>
                                <p className="text-xs text-purple-400 mt-1">{action.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </main>
    );
}
