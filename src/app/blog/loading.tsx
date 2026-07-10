export default function BlogLoading() {
  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-surface-container rounded-lg mx-auto mb-unit-lg" />
          <div className="h-64 bg-surface-container rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-surface-container rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
