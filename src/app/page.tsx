import Link from "next/link";
import profile from "../../content/profile.json";
import { getBlogPosts, getManuAge } from "@/lib/blogs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, ArrowRight, Heart, Sparkles, Clock, Bot, Palette } from "lucide-react";
import OnThisDay from "@/components/on-this-day";

const sectionLinks = [
  { href: "/drawings", emoji: "🎨", label: "Drawings", description: "Manu's artwork gallery" },
  { href: "/blog", emoji: "📖", label: "Stories", description: "Tales behind the art" },
  { href: "/gallery", emoji: "📸", label: "Gallery", description: "Photo memories" },
  { href: "/timeline", emoji: "🌱", label: "Timeline", description: "Growth milestones" },
  { href: "/ai-studio", emoji: "🪄", label: "AI Studio", description: "AI art magic!" },
  { href: "/ask-manu", emoji: "🗣️", label: "Ask Manu", description: "Yearly Q&A tracker" },
  { href: "/tags", emoji: "🏷️", label: "Tags", description: "Browse by category" },
  { href: "/games/train-crash", emoji: "🎮", label: "Games", description: "Fun games!" },
];

export default function Home() {
  const recentBlogs = getBlogPosts().slice(0, 3);
  const manuAge = getManuAge();

  return (
    <main className="min-h-screen px-6 py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Manu's Art World",
            "url": process.env.NEXT_PUBLIC_SITE_URL || "https://manus-art.vercel.app",
            "description": profile.tagline,
            "author": {
              "@type": "Person",
              "name": "Family"
            }
          })
        }}
      />
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Hero Section */}
        <section className="text-center space-y-6 py-4">
          <div className="text-6xl mb-4">🎨</div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight fun-gradient">
            Manu&apos;s Art World
          </h1>
          <p className="text-xl md:text-2xl text-purple-600 font-semibold">
            {profile.tagline}
          </p>
          <p className="text-lg text-purple-400 max-w-2xl mx-auto leading-relaxed">
            {profile.about}
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Badge className="text-base px-4 py-2 bg-purple-100 text-purple-700 border-purple-200">
              <Sparkles className="w-4 h-4 mr-2" /> {manuAge} years old
            </Badge>
            <Badge className="text-base px-4 py-2 bg-pink-100 text-pink-700 border-pink-200">
              <Palette className="w-4 h-4 mr-2" /> Little Artist Extraordinaire
            </Badge>
            <Badge className="text-base px-4 py-2 bg-yellow-100 text-yellow-700 border-yellow-200">
              <Heart className="w-4 h-4 mr-2" /> Created with love
            </Badge>
          </div>

          {profile.socials.github && (
            <div className="pt-2">
              <Button asChild variant="outline" size="sm" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                <Link href={profile.socials.github} target="_blank">
                  <Github className="w-4 h-4 mr-2" /> GitHub
                </Link>
              </Button>
            </div>
          )}
        </section>

        {/* Manu's Favorites */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-center text-purple-800">
            Manu&apos;s Favorite Things ⭐
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {profile.favorites.map((fav: { emoji: string; label: string }, i: number) => (
              <Card key={i} className="card-bounce bg-white border-purple-100 text-center shadow-sm">
                <CardContent className="pt-6 pb-4">
                  <div className="text-4xl mb-2">{fav.emoji}</div>
                  <p className="font-bold text-purple-700">{fav.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Explore Sections */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-center text-purple-800">
            Explore Manu&apos;s World 🗺️
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectionLinks.map((section) => (
              <Link key={section.href} href={section.href}>
                <Card className="card-bounce bg-white border-purple-100 shadow-sm h-full hover:border-purple-300 transition-colors">
                  <CardContent className="pt-6 pb-4 text-center">
                    <div className="text-4xl mb-2">{section.emoji}</div>
                    <p className="font-bold text-purple-700">{section.label}</p>
                    <p className="text-xs text-purple-400 mt-1">{section.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* On This Day */}
        <OnThisDay />

        {/* Recent Stories */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold tracking-tight text-purple-800">
              Latest Stories 📖
            </h2>
            <Button asChild variant="ghost" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50">
              <Link href="/blog">View all <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
          <div className="space-y-5">
            {recentBlogs.map((blog) => (
              <Card key={blog.slug} className="card-bounce bg-white border-purple-100 shadow-sm">
                <CardHeader>
                  <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2 md:gap-0 pb-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl text-purple-800">
                        <Link href={`/blog/${blog.slug}`} className="hover:underline decoration-purple-300">
                          {blog.title}
                        </Link>
                      </CardTitle>
                      {blog.category && (
                        <Badge variant="secondary" className="text-xs">{blog.category}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {blog.readingTime && (
                        <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {blog.readingTime} min
                        </Badge>
                      )}
                      {blog.aiModel && (
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-600 bg-blue-50">
                          <Bot className="w-3 h-3 mr-1" />
                          {blog.aiModel}
                        </Badge>
                      )}
                      <time className="text-sm text-purple-400 whitespace-nowrap">
                        {new Date(blog.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                  <CardDescription className="text-purple-700 text-base">
                    {blog.excerpt}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
            {recentBlogs.length === 0 && (
              <Card className="bg-white border-purple-100 shadow-sm">
                <CardContent className="py-12 text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <p className="text-purple-400 text-lg">No stories yet! Time to start drawing and writing! 📝🎨</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-purple-400 text-sm">
          <p>Made with ❤️ for Manu • Powered by AI magic ✨</p>
        </footer>
      </div>
    </main>
  );
}
