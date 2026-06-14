import { getBlogPosts, getAllTags } from "@/lib/blogs";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Tag, Clock } from "lucide-react";

export const metadata = {
    title: "Tags — Manu's Art World 🏷️",
    description: "Browse all story categories and tags from Manu's Art World",
};

export default function TagsPage() {
    const allTags = getAllTags();
    const blogs = getBlogPosts();

    // Group blogs by tag
    const tagMap: Record<string, typeof blogs> = {};
    for (const tag of allTags) {
        tagMap[tag] = blogs.filter(
            (b) =>
                (b.category && b.category.toLowerCase() === tag.toLowerCase()) ||
                (b.tags && b.tags.some((t: string) => t.toLowerCase() === tag.toLowerCase()))
        );
    }

    return (
        <main className="min-h-screen px-6 py-12 md:py-20">
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                    <Button asChild variant="ghost" className="mb-6 -ml-4 text-purple-400 hover:text-purple-700 hover:bg-purple-50">
                        <Link href="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back home</Link>
                    </Button>
                    <h1 className="text-4xl font-bold tracking-tight mb-4 text-purple-800">
                        Tags & Categories 🏷️
                    </h1>
                    <p className="text-xl text-purple-400 mb-8">
                        Browse Manu&apos;s stories by topic!
                    </p>

                    {/* Tag cloud */}
                    <div className="flex flex-wrap gap-3 mb-10">
                        {allTags.map((tag) => (
                            <a key={tag} href={`#${tag.toLowerCase().replace(/\s+/g, "-")}`}>
                                <Badge
                                    variant="secondary"
                                    className="text-sm px-4 py-2 cursor-pointer hover:bg-purple-200 transition-colors"
                                >
                                    <Tag className="w-3 h-3 mr-1.5" />
                                    {tag}
                                    <span className="ml-2 bg-purple-200 text-purple-700 text-xs px-1.5 py-0.5 rounded-full">
                                        {tagMap[tag]?.length || 0}
                                    </span>
                                </Badge>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Posts grouped by tag */}
                {allTags.map((tag) => (
                    <section
                        key={tag}
                        id={tag.toLowerCase().replace(/\s+/g, "-")}
                        className="space-y-4 scroll-mt-20"
                    >
                        <h2 className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            {tag}
                            <span className="text-sm font-normal text-purple-400">
                                ({tagMap[tag]?.length || 0} {tagMap[tag]?.length === 1 ? "story" : "stories"})
                            </span>
                        </h2>
                        <div className="space-y-3">
                            {tagMap[tag]?.map((blog) => (
                                <Card key={blog.slug} className="card-bounce bg-white border-purple-100 shadow-sm">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2 md:gap-0">
                                            <CardTitle className="text-lg text-purple-800">
                                                <Link href={`/blog/${blog.slug}`} className="hover:underline decoration-purple-300">
                                                    {blog.title}
                                                </Link>
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                {blog.readingTime && (
                                                    <Badge variant="outline" className="text-xs border-purple-200 text-purple-500">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {blog.readingTime} min read
                                                    </Badge>
                                                )}
                                                <time className="text-sm text-purple-400 whitespace-nowrap">
                                                    {new Date(blog.date).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </time>
                                            </div>
                                        </div>
                                        <CardDescription className="text-purple-500">
                                            {blog.excerpt}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                            {(!tagMap[tag] || tagMap[tag].length === 0) && (
                                <p className="text-purple-400 text-sm">No stories yet!</p>
                            )}
                        </div>
                    </section>
                ))}

                {allTags.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">🏷️</div>
                        <p className="text-purple-400 text-lg">No tags yet! Stories will be tagged as they&apos;re written.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
