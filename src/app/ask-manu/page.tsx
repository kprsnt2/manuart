import askManuData from "../../../content/ask-nanu.json";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AskManuPage() {
    const { questions, answers } = askManuData;
    const years = Object.keys(answers).sort();

    return (
        <main className="min-h-screen px-6 py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-purple-800 mb-4">
                        Ask Manu 🗣️
                    </h1>
                    <p className="text-xl text-purple-400 max-w-2xl mx-auto">
                        The same questions, asked every year. Watch how Manu&apos;s answers change as she grows! 😄
                    </p>
                </div>

                <div className="space-y-8">
                    {questions.map((question, qi) => (
                        <Card key={qi} className="bg-white border-purple-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3">
                                <h3 className="text-white font-bold text-lg">
                                    {qi + 1}. {question}
                                </h3>
                            </div>
                            <CardContent className="pt-4 pb-4">
                                <div className="grid gap-3 md:grid-cols-2">
                                    {years.map((year) => {
                                        const yearData = answers[year as keyof typeof answers];
                                        const response = yearData.responses[qi];
                                        if (!response) return null;
                                        return (
                                            <div
                                                key={year}
                                                className="bg-purple-50 rounded-xl p-4 border border-purple-100"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge className="bg-purple-600 text-white text-xs">{year}</Badge>
                                                    <span className="text-xs text-purple-400">Age {yearData.age}</span>
                                                </div>
                                                <p className="text-purple-800 font-medium">&ldquo;{response}&rdquo;</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center mt-12 text-purple-300 text-sm">
                    <p>New answers will be added every year! 📅</p>
                </div>
            </div>
        </main>
    );
}
