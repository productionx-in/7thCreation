import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase, type Post } from '@/lib/supabase';
import { useSeo } from '@/lib/seo';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ContactButton } from '@/components/ContactButton';
import { FadeIn } from '@/components/FadeIn';

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => setPost(data));
  }, [slug]);

  useSeo({
    title: post ? `${post.title} — 7th Creation Journal` : '7th Creation Journal',
    description: post?.excerpt ?? 'Notes on photography, film and production from 7th Creation.',
    jsonLd: post
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.cover_image_url ?? undefined,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          author: { '@type': 'Organization', name: post.author },
          publisher: { '@type': 'Organization', name: '7th Creation' },
          mainEntityOfPage: `https://www.7thcreation.in/blog/${post.slug}`,
        }
      : undefined,
  });

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-ink">
        <SiteHeader />
        <p className="mx-auto max-w-3xl px-5 py-24 text-sm text-[#767F83]">Loading…</p>
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="min-h-screen bg-ink">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-5 py-24 text-center">
          <h1 className="font-display text-3xl text-[#E6DECD]">Post not found</h1>
          <p className="mt-3 text-sm text-[#767F83]">
            It may have been unpublished or the link is wrong.
          </p>
          <Link to="/blog" className="mt-6 inline-block text-sm text-[#C6A15B] hover:text-[#E4CFA0]">
            ← Back to the journal
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20 md:px-10">
        <FadeIn>
          <Link to="/blog" className="text-xs uppercase tracking-[0.3em] text-[#767F83] hover:text-[#C6A15B]">
            ← Journal
          </Link>
          <p className="mt-6 text-[0.65rem] uppercase tracking-[0.3em] text-[#C6A15B]">
            {new Date(post.published_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
            {post.tags.length > 0 ? ` · ${post.tags.join(', ')}` : ''}
          </p>
          <h1 className="mt-3 font-display text-3xl font-light leading-tight text-[#E6DECD] sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#767F83]">{post.excerpt}</p>
        </FadeIn>

        {post.cover_image_url && (
          <FadeIn delay={0.1}>
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          </FadeIn>
        )}

        <FadeIn delay={0.15}>
          <div className="prose-blog mt-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mt-16 flex flex-col items-start gap-4 border-t border-[#767F83]/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#767F83]">Have a shoot in mind? We'd like to hear about it.</p>
            <ContactButton />
          </div>
        </FadeIn>
      </article>

      <SiteFooter />
    </div>
  );
}
