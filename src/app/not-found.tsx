import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-2 font-display text-3xl font-semibold text-graphite">Page not found</h1>
        <p className="mt-3 text-[15px] text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-md bg-blue px-4 py-2 text-sm font-medium text-white hover:bg-blue/90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
