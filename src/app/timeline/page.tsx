import timelineData from "../../../content/timeline.json";
import { Card, CardContent } from "@/components/ui/card";

interface Milestone {
    date: string;
    age: string;
    title: string;
    emoji: string;
    description: string;
}

export default function TimelinePage() {
    const milestones: Milestone[] = timelineData;

    return (
        <main className="min-h-screen px-6 py-12 md:py-20">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-purple-800 mb-4">
                        Manu&apos;s Growth Timeline 🌱
                    </h1>
                    <p className="text-xl text-purple-400">
                        Every big moment, every tiny step — they all matter! ✨
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-300 via-pink-300 to-yellow-300 rounded-full transform md:-translate-x-1/2" />

                    <div className="space-y-8">
                        {milestones.map((milestone, i) => (
                            <div
                                key={i}
                                className={`relative flex items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                {/* Dot */}
                                <div className="absolute left-6 md:left-1/2 w-12 h-12 bg-white border-4 border-purple-300 rounded-full flex items-center justify-center text-2xl z-10 transform -translate-x-1/2 shadow-md">
                                    {milestone.emoji}
                                </div>

                                {/* Card */}
                                <div className={`ml-16 md:ml-0 md:w-5/12 ${i % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                                    <Card className="card-bounce bg-white border-purple-100 shadow-sm">
                                        <CardContent className="pt-4 pb-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-semibold text-purple-400 bg-purple-50 px-2 py-0.5 rounded-full">
                                                    {milestone.age}
                                                </span>
                                                <span className="text-xs text-purple-300">
                                                    {new Date(milestone.date).toLocaleDateString("en-US", {
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-purple-800 mb-1">{milestone.title}</h3>
                                            <p className="text-purple-500 text-sm">{milestone.description}</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer hint */}
                <div className="text-center mt-12 text-purple-300 text-sm">
                    <p>More milestones to come... Manu&apos;s art journey is just getting started! 🚀🎨</p>
                </div>
            </div>
        </main>
    );
}
