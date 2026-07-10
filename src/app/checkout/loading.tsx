export default function CheckoutLoading() {
  return (
    <main className="flex-grow pt-32 pb-unit-xl">
      <div className="max-w-4xl mx-auto px-6">
        <div className="h-8 w-48 bg-surface-container rounded animate-pulse mb-unit-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="space-y-4">
            <div className="h-10 bg-surface-container rounded-lg animate-pulse" />
            <div className="h-10 bg-surface-container rounded-lg animate-pulse" />
            <div className="h-10 bg-surface-container rounded-lg animate-pulse" />
          </div>
          <div className="h-64 bg-surface-container rounded-xl animate-pulse" />
        </div>
      </div>
    </main>
  );
}
