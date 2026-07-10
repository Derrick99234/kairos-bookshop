"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-grow flex items-center justify-center pt-28 pb-unit-xl px-6">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-8xl text-secondary opacity-50 block mb-4">error</span>
        <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Something Went Wrong</h1>
        <p className="text-on-surface-variant font-body-lg mb-2">
          An unexpected error occurred. Please try again.
        </p>
        <p className="text-sm text-outline mb-6 font-mono">{error.message}</p>
        <button
          onClick={reset}
          className="bg-primary text-white font-label-md py-4 px-unit-lg rounded-lg inline-block hover:bg-primary-fixed-dim transition-all"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}
