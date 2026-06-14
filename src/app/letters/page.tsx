import lettersData from "../../../content/letters.json";
import { getManuAge } from "@/lib/blogs";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Heart } from "lucide-react";

interface Letter {
    targetAge: number;
    title: string;
    content: string;
    writtenDate: string;
}

export default function LettersPage() {
    const letters: Letter[] = lettersData;
    const manuAge = getManuAge();

    return (
        <main className="min-h-screen px-6 py-12 md:py-20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-purple-800 mb-4">
                        Letters to Future Manu 💌
                    </h1>
                    <p className="text-xl text-purple-400 max-w-2xl mx-auto">
                        Messages sealed with love — waiting for the right moment to be opened.
                    </p>
                </div>

                <div className="space-y-6">
                    {letters.map((letter, i) => {
                        const isUnlocked = manuAge >= letter.targetAge;

                        return (
                            <Card
                                key={i}
                                className={`overflow-hidden transition-all ${isUnlocked
                                        ? "bg-white border-purple-200 shadow-md"
                                        : "bg-gray-50 border-gray-200 opacity-80"
                                    }`}
                            >
                                {/* Envelope header */}
                                <div
                                    className={`px-6 py-4 flex items-center justify-between ${isUnlocked
                                            ? "bg-gradient-to-r from-pink-100 to-yellow-100"
                                            : "bg-gray-100"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">{isUnlocked ? "📨" : "✉️"}</span>
                                        <div>
                                            <h3 className={`font-bold text-lg ${isUnlocked ? "text-purple-800" : "text-gray-500"}`}>
                                                {isUnlocked ? letter.title : `For Manu at Age ${letter.targetAge}`}
                                            </h3>
                                            <p className="text-sm text-purple-400">
                                                Written on{" "}
                                                {new Date(letter.writtenDate).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {isUnlocked ? (
                                        <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                                    ) : (
                                        <Lock className="w-6 h-6 text-gray-400" />
                                    )}
                                </div>

                                <CardContent className="pt-4 pb-6">
                                    {isUnlocked ? (
                                        <div className="prose prose-purple max-w-none">
                                            <p className="text-purple-800 leading-relaxed whitespace-pre-line">
                                                {letter.content}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Lock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-400 font-semibold text-lg">
                                                🔒 Open when you&apos;re {letter.targetAge}!
                                            </p>
                                            <p className="text-gray-300 text-sm mt-1">
                                                {letter.targetAge - manuAge} more year{letter.targetAge - manuAge !== 1 ? "s" : ""} to go...
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="text-center mt-12 text-purple-300 text-sm">
                    <p>More letters will be added as the years go by... ❤️</p>
                </div>
            </div>
        </main>
    );
}
