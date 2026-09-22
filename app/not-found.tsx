import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-semibold text-brand">Page not found</h1>
      <Link href="/admin" className="mt-6 text-sm font-semibold text-accent">
        Back to CMS
      </Link>
    </div>
  );
}
