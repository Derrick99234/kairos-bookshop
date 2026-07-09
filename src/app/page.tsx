"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Book {
  id: string; title: string; slug: string; author: string; price: number;
  comparePrice: number; imageUrl: string; featured: boolean; stock: number;
  category: { name: string; slug: string };
}

interface Category {
  id: string; name: string; slug: string; description: string; imageUrl: string;
}

interface BlogPost {
  id: string; title: string; slug: string; excerpt: string;
  author: string; category: string; imageUrl: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Spiritual Growth": "church", "Prayer": "auto_stories", "Faith": "volunteer_activism",
  "Prophetic": "rocket_launch", "Leadership": "person_apron", "Bible Study": "menu_book",
  "Marriage": "favorite", "Devotional": "auto_awesome",
};

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [featured, setFeatured] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  async function addToCart(book: Book) {
    if (!session) { router.push("/signin"); return; }
    setAddingId(book.id);
    try {
      await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id, quantity: 1, format: "PAPERBACK" }),
      });
    } catch { /* ignore */ }
    setTimeout(() => setAddingId(null), 1500);
  }

  useEffect(() => {
    fetch("/api/books?featured=true&limit=4")
      .then((r) => r.json()).then((d) => setFeatured(d.books || [])).catch(() => {});
    fetch("/api/categories")
      .then((r) => r.json()).then(setCategories).catch(() => {});
    fetch("/api/blog?limit=2")
      .then((r) => r.json()).then((d) => setPosts(Array.isArray(d) ? d.slice(0, 2) : [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (search.trim().length < 2) { setSearchResults([]); setShowResults(false); return; }
    setSearching(true);
    setShowResults(true);
    const t = setTimeout(() => {
      fetch(`/api/books?search=${encodeURIComponent(search.trim())}&limit=5`)
        .then((r) => r.json())
        .then((d) => setSearchResults(d.books || []))
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) window.location.href = `/books?search=${encodeURIComponent(search.trim())}`;
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubscribed(true);
    setEmail("");
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-primary-container py-unit-xl md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: "linear-gradient(135deg, #493DBB 0%, #E03636 100%)" }} />
        <div className="relative max-w-4xl mx-auto px-margin-mobile text-center flex flex-col items-center gap-unit-lg">
          <div className="flex flex-col gap-unit-sm">
            <span className="text-on-primary-container font-label-md uppercase tracking-[0.2em] bg-white/10 self-center px-4 py-1.5 rounded-full border border-white/20">Spiritual Wisdom Library</span>
            <h1 className="font-headline-xl text-4xl md:text-6xl text-white leading-tight">Find Your Next <br /><span className="text-secondary-fixed">Transformation</span></h1>
            <p className="font-body-lg text-lg md:text-xl text-white/80 max-w-2xl mx-auto">Search thousands of curated spiritual titles, theological insights, and life-changing devotionals designed to steward your divine purpose.</p>
          </div>
            <form onSubmit={handleSearch} className="w-full max-w-2xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary to-primary-fixed-dim rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
              <div className="relative flex items-center bg-white rounded-xl shadow-2xl overflow-hidden p-1.5">
                <span className="material-symbols-outlined ml-4 text-outline shrink-0">search</span>
                <input value={search} onChange={(e) => setSearch(e.target.value)} onFocus={() => search.trim().length >= 2 && setShowResults(true)} onBlur={() => setTimeout(() => setShowResults(false), 200)} className="flex-grow border-none focus:ring-0 px-4 py-4 text-body-lg text-on-surface placeholder:text-outline min-w-0" placeholder="Search by title, author, or topic..." autoComplete="off" />
              </div>
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-outline-variant overflow-hidden z-50">
                  {searching ? (
                    <div className="p-4 text-center text-on-surface-variant text-sm">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-on-surface-variant text-sm">No books found for &ldquo;{search}&rdquo;</div>
                  ) : (
                    searchResults.map((book) => (
                      <Link key={book.id} href={`/books/${book.slug}`} onClick={() => setShowResults(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-container transition-colors border-b border-outline-variant last:border-0">
                        {book.imageUrl ? (
                          <img src={book.imageUrl} alt="" className="w-10 h-14 rounded object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        ) : (
                          <div className="w-10 h-14 bg-surface-container-high rounded flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-outline text-sm">book</span></div>
                        )}
                        <div className="text-left min-w-0">
                          <p className="font-label-md text-label-md text-on-surface truncate">{book.title}</p>
                          <p className="text-xs text-on-surface-variant truncate">{book.author} — ₦{book.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                      </Link>
                    ))
                  )}
                  {searchResults.length > 0 && (
                    <Link href={`/books?search=${encodeURIComponent(search.trim())}`} onClick={() => setShowResults(false)} className="block p-3 text-center text-primary font-label-md text-label-md hover:bg-primary-container/10 transition-colors border-t border-outline-variant">
                      View all results
                    </Link>
                  )}
                </div>
              )}
            </form>
          <div className="flex flex-wrap justify-center gap-unit-sm text-white/80 text-label-sm">
            <span className="text-white/60">Popular:</span>
            <Link href="/books?search=Kingdom" className="hover:text-white underline decoration-white/30">Kingdom Finance</Link>
            <Link href="/books?search=Prophetic" className="hover:text-white underline decoration-white/30">Prophetic Pulse</Link>
            <Link href="/books?search=Stewardship" className="hover:text-white underline decoration-white/30">Stewardship</Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-unit-xl bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-end mb-unit-xl gap-unit-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary">Featured Wisdom</h2>
              <p className="text-on-surface-variant font-body-md mt-unit-xs">The latest profound releases from Dr. Isaiah Wealth and global faith leaders.</p>
            </div>
            <Link className="text-secondary font-label-md flex items-center gap-unit-sm hover:gap-unit-md transition-all" href="/books">View Catalog <span className="material-symbols-outlined">arrow_forward</span></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
            {featured.length === 0 && Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-outline-variant overflow-hidden animate-pulse">
                <div className="aspect-[3/4] bg-surface-container-low" />
                <div className="p-unit-md space-y-2">
                  <div className="h-3 w-16 bg-surface-container-low rounded" />
                  <div className="h-4 w-32 bg-surface-container-low rounded" />
                  <div className="h-4 w-20 bg-surface-container-low rounded" />
                </div>
              </div>
            ))}
            {featured.map((book) => (
              <Link key={book.id} href={`/books/${book.slug}`} className="bg-white rounded-xl border border-outline-variant overflow-hidden hover:shadow-lg transition-all flex flex-col group">
                <div className="aspect-[3/4] bg-surface-container-low flex items-center justify-center overflow-hidden">
                  {book.imageUrl ? (
                    <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="material-symbols-outlined text-outline opacity-30 text-6xl">book</span>
                  )}
                </div>
                <div className="p-unit-md flex flex-col flex-grow">
                  <span className="text-label-sm text-secondary uppercase tracking-widest mb-unit-xs">{book.category.name}</span>
                  <h4 className="font-headline-md text-lg text-primary line-clamp-2 mb-unit-sm">{book.title}</h4>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase">{book.author}</p>
                  <div className="mt-auto flex items-center justify-between pt-unit-sm">
                    <span className="font-bold text-primary">₦{book.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <button onClick={(e) => { e.preventDefault(); addToCart(book); }} className="p-2 bg-primary/5 text-primary rounded-full hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined text-sm">{addingId === book.id ? "check" : "shopping_cart"}</span>
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-unit-xl bg-white">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-unit-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary">Browse by Category</h2>
            <div className="w-24 h-1 bg-secondary rounded-full mx-auto mt-unit-sm" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-unit-md md:gap-gutter">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/books?category=${cat.id}`} className="bg-surface-container-low p-unit-lg rounded-xl flex flex-col items-center justify-center gap-unit-sm text-center border border-outline-variant transition-all hover:shadow-md h-40 group">
                <span className="material-symbols-outlined text-[40px] group-hover:scale-110 transition-transform text-primary">{CATEGORY_ICONS[cat.name] || "category"}</span>
                <h4 className="font-label-md text-primary uppercase">{cat.name}</h4>
              </Link>
            ))}
          </div>
          <div className="mt-unit-xl text-center">
            <Link href="/books" className="text-primary font-label-md inline-flex items-center gap-unit-sm hover:gap-unit-md transition-all">Explore All Categories <span className="material-symbols-outlined">arrow_forward</span></Link>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="py-unit-xl bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-unit-xl items-center">
          <div className="relative group">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative aspect-square rounded-2xl overflow-hidden border-8 border-white shadow-2xl">
              <img alt="Dr. Isaiah Wealth" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-wa0buzS7xgoyHwvoJDEGPsfLL6L0n6ZswGrblmdyTerqkt4mHhN4BTKu3fu0MRT2J3fA2oH0WWDD5sSf3Jc6tmquP3ynaOfQMJIF_-oAeBV-lMtieXeAtnzCv91zComzGOuj35Touews4tVvsM9wczU4xjm-o5bDhf6Nw9yJv0K9tNNMDdCOTfP0zhViYzQN8_ltSqBgdDwyAmAfIbQ81cGiQ6Kb3jBy4_V2ELgvGAszfqP8jBWq3wTjc5fROaJ3HYhsS8-O5Ua0gzQ" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary text-white p-unit-md rounded-xl shadow-lg">
              <p className="font-headline-md text-xl">Dr. Isaiah Wealth</p>
              <p className="text-label-sm opacity-80">Author &amp; Visionary</p>
            </div>
          </div>
          <div className="flex flex-col gap-unit-md">
            <span className="text-secondary font-label-md tracking-widest uppercase">The Author</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Voices of Revelation</h2>
            <p className="font-body-lg text-on-surface-variant leading-relaxed">Kairos Bookshop features the profound literary works of Dr. Isaiah Wealth, whose ministry has impacted millions globally. Each book is crafted with a meticulous blend of biblical accuracy and practical application.</p>
            <p className="font-body-md text-on-surface-variant italic border-l-4 border-secondary pl-unit-md py-2">&ldquo;My mission is to deliver the word in its purity, ensuring that every believer is equipped with the wisdom needed to dominate in their sphere of influence.&rdquo;</p>
            <Link href="/books" className="bg-primary text-white font-label-md py-4 px-unit-lg rounded-lg self-start hover:shadow-lg transition-all mt-unit-sm">Browse Books</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-unit-xl bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-unit-xl">Transformed Lives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {[
              { name: "Samuel O.", location: "Lagos, Nigeria", text: "The 'Art of Kingdom Finance' completely shifted my perspective on wealth. I went from struggling to stewardship in less than a year." },
              { name: "Anabelle A.", location: "London, UK", text: "Strategic Prayer Manual is now my daily companion. The depth of revelation is unlike anything I've read before." },
              { name: "David M.", location: "Houston, USA", text: "As a leader, the principles in 'Divine Influence' have given me a roadmap for scaling my impact and organization." },
            ].map((t, i) => (
              <div key={i} className="bg-white p-unit-lg rounded-2xl border border-outline-variant shadow-sm flex flex-col gap-unit-md">
                <div className="flex text-secondary">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <span key={s} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="font-body-md text-on-surface-variant">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-auto pt-unit-md border-t border-outline-variant flex items-center gap-unit-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold">{t.name.charAt(0)}</div>
                  <div>
                    <p className="font-label-md">{t.name}</p>
                    <p className="text-label-sm text-outline">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      {posts.length > 0 && (
        <section className="py-unit-xl bg-surface-container-low">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="flex flex-col md:flex-row justify-between items-end mb-unit-xl gap-unit-md">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary">Latest Insights</h2>
                <p className="text-on-surface-variant font-body-md">Fresh spiritual perspectives to nourish your walk.</p>
              </div>
              <Link href="/blog" className="text-secondary font-label-md flex items-center gap-unit-sm hover:gap-unit-md transition-all shrink-0">Read Blog <span className="material-symbols-outlined">arrow_forward</span></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="bg-white rounded-xl border border-outline-variant overflow-hidden flex hover:shadow-lg transition-all">
                  <div className="w-24 bg-primary flex-shrink-0 flex items-center justify-center text-white font-headline-md text-xl">{post.category.charAt(0)}</div>
                  <div className="p-unit-md flex-grow">
                    <h4 className="font-headline-md text-lg text-primary">{post.title}</h4>
                    <p className="text-body-md text-on-surface-variant line-clamp-2 mt-1">{post.excerpt}</p>
                    <div className="mt-unit-sm flex items-center gap-2 text-outline text-label-sm">
                      <span className="material-symbols-outlined text-sm">person</span>
                      {post.author}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="bg-primary-container py-unit-xl">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center text-center">
          <h2 className="font-headline-lg text-headline-lg text-white mb-unit-sm">Join the Kairos Community</h2>
          <p className="font-body-md text-white/80 mb-unit-lg max-w-lg">Get exclusive updates on new releases, spiritual insights, and upcoming events from Dr. Isaiah Wealth.</p>
          {subscribed ? (
            <p className="text-white font-body-md bg-white/10 px-unit-lg py-unit-md rounded-lg">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-unit-sm w-full max-w-md">
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="flex-grow rounded-lg border-0 px-unit-md py-4 text-body-md focus:ring-2 focus:ring-secondary outline-none" placeholder="Enter your email address" type="email" required />
              <button type="submit" className="bg-secondary text-white font-label-md px-unit-lg py-4 rounded-lg hover:brightness-110 active:scale-95 transition-all">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
