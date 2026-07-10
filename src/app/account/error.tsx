"use client";

export default function AccountError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-grow pt-32 pb-unit-xl px-6">
      <div className="max-w-6xl mx-auto text-center">
        <span className="material-symbols-outlined text-6xl text-secondary opacity-50 mb-4">person_off</span>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Account Error</h1>
        <p className="text-on-surface-variant mb-6">{error.message}</p>
        <button onClick={reset} className="bg-primary text-white font-label-md py-3 px-unit-md rounded-lg hover:bg-primary-fixed-dim transition-all">
          Try Again
        </button>
      </div>
    </main>
  );
}
