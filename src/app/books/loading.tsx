export default function BooksLoading() {
  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-10 w-48 bg-surface-container rounded-lg animate-pulse mb-unit-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-outline-variant animate-pulse">
              <div className="aspect-[3/4] bg-surface-container" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-surface-container rounded w-3/4" />
                <div className="h-3 bg-surface-container rounded w-1/2" />
                <div className="h-4 bg-surface-container rounded w-1/3 mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
