"use client";

import { useRouter } from "next/navigation";

/** Route rendering errors stay inside the shared site layout. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();
  return (
    <section className="ui-container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center" role="alert">
      <h1 className="font-sans text-xl font-bold text-navy-900">This page couldn’t load</h1>
      <p className="text-ink-muted">Please check your connection and try again.</p>
      <button type="button" className="btn btn-primary" onClick={() => { router.refresh(); reset(); }}>
        Retry
      </button>
    </section>
  );
}
