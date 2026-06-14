import { getBlogPosts } from "@/lib/blogs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://manus-art.vercel.app";

export async function GET() {
    const posts = getBlogPosts();

    const rssItems = posts
        .map(
            (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.category ? `<category>${post.category}</category>` : ""}
    </item>`
        )
        .join("");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Manu's Art World 🎨</title>
    <link>${SITE_URL}</link>
    <description>A magical showcase of Manu's drawings, paintings, and creative adventures — where art comes alive! 🖌️</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rss.trim(), {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "s-maxage=3600, stale-while-revalidate",
        },
    });
}
