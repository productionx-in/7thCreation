import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Post } from '@/lib/supabase';
import { useSeo } from '@/lib/seo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { FadeIn } from '@/components/FadeIn';

export function BlogListPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState(false);

  useSeo({
    title: '7th Creation Journal — Notes on Photography, Film & Production',
    description:
      'Gear guides, trends, and behind-the-scenes notes from a creative production studio in Visakhapatnam and Hyderabad — photography, film, events and more.',
  });

  useEffect(() => {
    supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data, error: err }) => {
        if (err) setError(true);
        else setPosts(data ?? []);
      });
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <SiteHeader />

      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20 md:px-10 md:py-24">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.3em] text-[#767F83]">Journal</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-tight text-[#E6DECD] sm:text-6xl">
            Notes from the set.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#767F83] sm:text-base">
            Gear, trends and craft — what we're learning while we shoot commercial films, weddings,
            advertising, events, music videos and portraits across Visakhapatnam and Hyderabad.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts === null && !error && (
            <p className="col-span-full text-sm text-[#767F83]">Loading posts…</p>
          )}
          {error && (
            <p className="col-span-full text-sm text-[#767F83]">
              Couldn't load posts right now — check back shortly.
            </p>
          )}
          {posts?.length === 0 && (
            <p className="col-span-full text-sm text-[#767F83]">Nothing published yet — check back soon.</p>
          )}
          {posts?.map((post, i) => (
            <FadeIn key={post.id} delay={Math.min(i, 6) * 0.05}>
              <Link to={`/blog/${post.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#0D1015]">
                  {post.cover_image_url && (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  )}
                </div>
                <p className="mt-4 text-[0.65rem] uppercase tracking-[0.3em] text-[#C6A15B]">
                  {new Date(post.published_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                  {post.tags[0] ? ` · ${post.tags[0]}` : ''}
                </p>
                <h2 className="mt-2 font-display text-xl text-[#E6DECD] transition-colors group-hover:text-[#C6A15B] sm:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#767F83]">{post.excerpt}</p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
