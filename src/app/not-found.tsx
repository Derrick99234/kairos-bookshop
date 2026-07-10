import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-grow flex items-center justify-center pt-28 pb-unit-xl px-6">
      <div className="text-center max-w-md">
        <span className="material-symbols-outlined text-8xl text-outline opacity-30 block mb-4">auto_stories</span>
        <h1 className="font-headline-xl text-headline-xl text-primary mb-2">Page Not Found</h1>
        <p className="text-on-surface-variant font-body-lg mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="bg-primary text-white font-label-md py-4 px-unit-lg rounded-lg inline-block hover:bg-primary-fixed-dim transition-all"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
