import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blogs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://manus-art.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getBlogPosts();

    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    const staticPages: MetadataRoute.Sitemap = [
        { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
        { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${SITE_URL}/drawings`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
        { url: `${SITE_URL}/ai-studio`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
        { url: `${SITE_URL}/tags`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
        { url: `${SITE_URL}/timeline`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${SITE_URL}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${SITE_URL}/ask-manu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${SITE_URL}/letters`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ];

    return [...staticPages, ...blogEntries];
}
