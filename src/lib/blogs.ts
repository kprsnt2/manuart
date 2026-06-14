import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const blogsDirectory = path.join(process.cwd(), 'content', 'blogs');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  htmlContent?: string;
  category?: string;
  drawing?: string;
  manuAge?: number;
  nanuAge?: number;
  readingTime?: number;
  tags?: string[];
  aiModel?: string;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function getBlogPosts(): BlogPost[] {
  if (!fs.existsSync(blogsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(blogsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md') && !fileName.endsWith('_te.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(blogsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        slug,
        title: matterResult.data.title || 'Untitled',
        date: matterResult.data.date || new Date().toISOString(),
        excerpt: matterResult.data.excerpt || '',
        content: matterResult.content,
        category: matterResult.data.category || '',
        drawing: matterResult.data.drawing || '',
        manuAge: matterResult.data.manuAge || matterResult.data.nanuAge || undefined,
        nanuAge: matterResult.data.nanuAge || matterResult.data.manuAge || undefined,
        readingTime: calculateReadingTime(matterResult.content),
        tags: matterResult.data.tags || (matterResult.data.category ? [matterResult.data.category] : []),
        aiModel: matterResult.data.aiModel || matterResult.data.ai_model || '',
      };
    });

  return allPostsData.sort((a, b) => {
    if (new Date(a.date) < new Date(b.date)) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(blogsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const htmlContent = processedContent.toString();

  return {
    slug,
    title: matterResult.data.title || 'Untitled',
    date: matterResult.data.date || new Date().toISOString(),
    excerpt: matterResult.data.excerpt || '',
    content: matterResult.content,
    htmlContent,
    category: matterResult.data.category || '',
    drawing: matterResult.data.drawing || '',
    manuAge: matterResult.data.manuAge || matterResult.data.nanuAge || undefined,
    nanuAge: matterResult.data.nanuAge || matterResult.data.nanuAge || undefined,
    readingTime: calculateReadingTime(matterResult.content),
    tags: matterResult.data.tags || (matterResult.data.category ? [matterResult.data.category] : []),
    aiModel: matterResult.data.aiModel || matterResult.data.ai_model || '',
  };
}

export function getAllTags(): string[] {
  const posts = getBlogPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    if (post.category) tagSet.add(post.category);
    if (post.tags) post.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Helper to calculate Manu's current age
export function getManuAge(): number {
  const birthday = new Date(2019, 2, 25); // March 25, 2019
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
}

// Keep backward compatibility
export const getNanuAge = getManuAge;
