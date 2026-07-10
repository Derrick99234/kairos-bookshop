export default function RootLoading() {
  return (
    <main className="flex-grow flex items-center justify-center pt-28 pb-unit-xl">
      <div className="flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-5xl text-primary animate-spin">progress_activity</span>
        <p className="text-on-surface-variant font-body-md">Loading...</p>
      </div>
    </main>
  );
}
