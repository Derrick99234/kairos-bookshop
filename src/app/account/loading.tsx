export default function AccountLoading() {
  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-gutter">
          <div className="hidden md:block w-56 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-surface-container rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-8 w-48 bg-surface-container rounded animate-pulse" />
            <div className="h-64 bg-surface-container rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  );
}
