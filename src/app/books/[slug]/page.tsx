"use client";

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Review {
  id: string; rating: number; comment: string; createdAt: string;
  user: { name: string };
}

interface Book {
  id: string; title: string; slug: string; author: string; description: string;
  isbn: string; pages: number; price: number; comparePrice: number;
  format: string; stock: number; imageUrl: string; images: string;
  category: { id: string; name: string; slug: string };
  reviews: Review[];
}

export default function BookDetail() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewDone, setReviewDone] = useState(false);

  useEffect(() => {
    if (!params?.slug) return;
    fetch(`/api/books/${params.slug}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((b) => {
        setBook(b);
        if (session) {
          fetch("/api/wishlist")
            .then((r) => r.json())
            .then((items) => {
              if (Array.isArray(items)) setWishlisted(items.some((i: { bookId: string }) => i.bookId === b.id));
            })
            .catch(() => {});
        }
      })
      .catch(() => router.push("/books"))
      .finally(() => setLoading(false));
  }, [params?.slug, router, session]);

  async function addToCart() {
    if (!book) return;
    if (!session) { router.push("/signin"); return; }
    try {
      await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id, quantity, format: book.format }),
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch { /* ignore */ }
  }

  async function toggleWishlist() {
    if (!book) return;
    if (!session) { router.push("/signin"); return; }
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setWishlisted(data.wishlisted);
    } catch { /* ignore */ }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!book) return;
    setReviewSubmitting(true);
    setReviewError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id, rating: reviewRating, comment: reviewComment }),
      });
      if (!res.ok) { const d = await res.json(); setReviewError(d.error || "Failed to submit review"); return; }
      setReviewDone(true);
      setReviewComment("");
      setReviewRating(5);
      const updated = await fetch(`/api/books/${params.slug}`).then((r) => r.json());
      setBook(updated);
    } catch { setReviewError("Something went wrong"); }
    finally { setReviewSubmitting(false); }
  }

  if (loading) return (
    <main className="flex-grow pt-32 pb-unit-xl max-w-7xl mx-auto px-6">
      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-unit-xl">
        <div className="aspect-[3/4] bg-surface-container rounded-xl" />
        <div className="space-y-4">
          <div className="h-6 w-24 bg-surface-container rounded" />
          <div className="h-10 w-3/4 bg-surface-container rounded" />
          <div className="h-4 w-1/2 bg-surface-container rounded" />
          <div className="h-20 bg-surface-container rounded" />
        </div>
      </div>
    </main>
  );

  if (!book) return null;

  const avgRating = book.reviews.length
    ? (book.reviews.reduce((s, r) => s + r.rating, 0) / book.reviews.length).toFixed(1)
    : "0.0";

  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-unit-lg">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link href="/books" className="hover:text-primary">Books</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface">{book.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-unit-xl">
          <div className="aspect-[3/4] bg-surface-container rounded-xl overflow-hidden">
            {book.imageUrl ? (
              <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline opacity-30 text-8xl">book</span></div>
            )}
          </div>

          <div className="flex flex-col gap-unit-md">
            <span className="text-label-sm uppercase tracking-widest text-secondary">{book.category.name}</span>
            <h1 className="font-headline-xl text-2xl md:text-headline-xl text-primary leading-tight">{book.title}</h1>
            <p className="font-headline-md text-headline-md text-on-surface-variant">by {book.author}</p>

            <div className="flex items-center gap-2">
              <div className="flex text-secondary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: `'FILL' ${i < Math.round(Number(avgRating)) ? 1 : 0}` }}>star</span>
                ))}
              </div>
              <span className="text-sm text-on-surface-variant">{avgRating} ({book.reviews.length} reviews)</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-headline-lg text-headline-lg text-primary">₦{book.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              {book.comparePrice > book.price && (
                <span className="text-lg text-on-surface-variant line-through">₦{book.comparePrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              )}
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{book.description}</p>

            <div className="grid grid-cols-2 gap-unit-sm text-sm">
              <div className="bg-surface-container-low p-unit-sm rounded-lg"><span className="text-on-surface-variant">ISBN:</span> {book.isbn || "N/A"}</div>
              <div className="bg-surface-container-low p-unit-sm rounded-lg"><span className="text-on-surface-variant">Pages:</span> {book.pages}</div>
              <div className="bg-surface-container-low p-unit-sm rounded-lg"><span className="text-on-surface-variant">Format:</span> {book.format}</div>
              <div className="bg-surface-container-low p-unit-sm rounded-lg"><span className="text-on-surface-variant">Stock:</span> {book.stock > 0 ? `${book.stock} available` : "Out of stock"}</div>
            </div>

            {book.stock > 0 && (
              <>
                <div className="flex items-center gap-unit-sm mt-unit-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container">-</button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(book.stock, quantity + 1))} className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-surface-container">+</button>
                </div>
                <div className="flex items-center gap-unit-sm">
                  <button onClick={addToCart} className="flex-1 bg-primary text-white font-label-md py-4 px-unit-lg rounded-lg hover:bg-primary-fixed-dim transition-all active:scale-95 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">{added ? "check" : "shopping_cart"}</span>
                    {added ? "Added!" : "Add to Cart"}
                  </button>
                  <button onClick={toggleWishlist} className={`p-4 border rounded-lg hover:bg-surface-container transition-all ${wishlisted ? "border-secondary bg-secondary/5" : "border-outline-variant"}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${wishlisted ? 1 : 0}` }}>{wishlisted ? "favorite" : "favorite"}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <section className="mt-unit-xl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-unit-lg">Customer Reviews</h2>
          {book.reviews.length > 0 ? (
            <div className="space-y-unit-md mb-unit-lg">
              {book.reviews.map((review) => (
                <div key={review.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-unit-md">
                  <div className="flex items-center justify-between mb-unit-sm">
                    <div className="flex items-center gap-unit-sm">
                      <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-sm">{review.user.name.charAt(0)}</div>
                      <span className="font-label-md">{review.user.name}</span>
                    </div>
                    <span className="text-xs text-on-surface-variant">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex text-secondary mb-unit-xs">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-body-md text-on-surface-variant">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-on-surface-variant mb-unit-lg">No reviews yet. Be the first to review!</p>
          )}

          {session ? (
            reviewDone ? (
              <p className="text-green-600 font-label-md bg-green-50 border border-green-200 rounded-xl p-unit-md">Review submitted! Thank you.</p>
            ) : (
              <form onSubmit={submitReview} className="bg-surface-container-low border border-outline-variant rounded-xl p-unit-md">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-unit-md">Write a Review</h3>
                {reviewError && <p className="text-red-600 text-sm mb-unit-sm">{reviewError}</p>}
                <div className="flex items-center gap-1 mb-unit-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" onClick={() => setReviewRating(i + 1)} className="text-secondary p-0.5">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${i < reviewRating ? 1 : 0}` }}>star</span>
                    </button>
                  ))}
                  <span className="text-sm text-on-surface-variant ml-2">{reviewRating} of 5</span>
                </div>
                <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Share your thoughts about this book..." className="w-full border border-outline-variant rounded-lg p-3 text-body-md outline-none focus:border-primary min-h-24 resize-none" />
                <button disabled={reviewSubmitting} className="mt-unit-sm bg-primary text-white font-label-md py-3 px-unit-lg rounded-lg hover:bg-primary-fixed-dim transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                  {reviewSubmitting ? <><span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> Submitting...</> : "Submit Review"}
                </button>
              </form>
            )
          ) : (
            <p className="text-on-surface-variant text-sm">Please <Link href="/signin" className="text-primary hover:underline">sign in</Link> to leave a review.</p>
          )}
        </section>
      </div>
    </main>
  );
}
