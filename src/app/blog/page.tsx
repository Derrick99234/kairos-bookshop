"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string;
  content: string; author: string; category: string; imageUrl: string;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-unit-xl">
          <h1 className="font-headline-xl text-2xl md:text-headline-xl text-primary">Kairos Insights</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl mx-auto">Spiritual wisdom, biblical insights, and practical guidance for your faith journey.</p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-surface-container rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-48 bg-surface-container rounded-xl" />)}
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-unit-lg text-on-surface-variant">No posts yet</div>
        ) : (
          <>
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="block bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-lg transition-all mb-gutter">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto bg-primary-container flex items-center justify-center min-h-[250px]">
                    <span className="material-symbols-outlined text-white/50 text-8xl">article</span>
                  </div>
                  <div className="p-unit-lg flex flex-col justify-center">
                    <span className="text-label-sm uppercase tracking-widest text-secondary mb-unit-xs">{featured.category}</span>
                    <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-sm">{featured.title}</h2>
                    <p className="text-body-md text-on-surface-variant line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center gap-2 mt-auto pt-unit-md text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">person</span>
                      {featured.author}
                      <span className="mx-2">·</span>
                      {new Date(featured.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Link>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {rest.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col">
                  <div className="aspect-video bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline opacity-30 text-5xl">article</span>
                  </div>
                  <div className="p-unit-md flex flex-col flex-grow">
                    <span className="text-label-sm uppercase tracking-widest text-secondary mb-unit-xs">{post.category}</span>
                    <h3 className="font-headline-md text-headline-md text-primary line-clamp-2 mb-unit-sm">{post.title}</h3>
                    <p className="text-sm text-on-surface-variant line-clamp-3 flex-grow">{post.excerpt}</p>
                    <div className="flex items-center gap-2 mt-unit-sm text-xs text-on-surface-variant pt-unit-sm border-t border-outline-variant">
                      <span className="material-symbols-outlined text-xs">person</span>
                      {post.author}
                      <span className="mx-1">·</span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
