import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description: string;
  jsonLd?: object;
}

// Minimal client-side SEO for routed pages. The CSR tradeoff is real —
// crawlers that don't execute JS (or execute it late) see the base
// index.html meta first — but modern Googlebot renders JS, and this beats
// shipping no per-page metadata at all. If organic blog traffic becomes the
// primary growth channel, migrating to a framework with real SSR/SSG
// (Next.js, Astro) would close that gap; noted here rather than silently
// building around it.
export function useSeo({ title, description, jsonLd }: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const descTag = document.querySelector('meta[name="description"]');
    const prevDesc = descTag?.getAttribute('content') ?? '';
    descTag?.setAttribute('content', description);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      descTag?.setAttribute('content', prevDesc);
      script?.remove();
    };
  }, [title, description, jsonLd]);
}
