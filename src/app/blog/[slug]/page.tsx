"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
}

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string;
  content: string; author: string; category: string; imageUrl: string;
  createdAt: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.slug) return;
    fetch(`/api/blog/${params.slug}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setPost)
      .catch(() => router.push("/blog"))
      .finally(() => setLoading(false));
  }, [params?.slug, router]);

  if (loading) return (
    <main className="flex-grow pt-32 pb-unit-xl max-w-3xl mx-auto px-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-24 bg-surface-container rounded" />
        <div className="h-10 w-3/4 bg-surface-container rounded" />
        <div className="h-4 w-1/2 bg-surface-container rounded" />
        <div className="h-64 bg-surface-container rounded-xl" />
      </div>
    </main>
  );

  if (!post) return null;

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <article className="max-w-3xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-unit-lg">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface truncate max-w-[200px]">{post.title}</span>
        </nav>

        <span className="text-label-sm uppercase tracking-widest text-secondary">{post.category}</span>
        <h1 className="font-headline-xl text-2xl md:text-headline-xl text-primary leading-tight mt-2 mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-unit-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-xs">{post.author.charAt(0)}</div>
            <span>{post.author}</span>
          </div>
          <span>·</span>
          <span>{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>

        <div className="aspect-video bg-surface-container rounded-xl overflow-hidden mb-unit-lg">
          {post.imageUrl ? <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline opacity-30 text-8xl">article</span></div>}
        </div>

        <div className="blog-content text-body-md text-on-surface-variant leading-relaxed" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />

        <div className="mt-unit-xl pt-unit-lg border-t border-outline-variant flex justify-between">
          <Link href="/blog" className="text-primary font-label-md flex items-center gap-2 hover:gap-3 transition-all">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Blog
          </Link>
        </div>
      </article>
    </main>
  );
}
