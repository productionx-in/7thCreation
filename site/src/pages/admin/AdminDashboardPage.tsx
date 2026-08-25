import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, type Post } from '@/lib/supabase';

export function AdminDashboardPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    supabase
      .from('posts')
      .select('*')
      .order('published_at', { ascending: false })
      .then(({ data }) => setPosts(data ?? []));
  };

  useEffect(load, []);

  const togglePublished = async (post: Post) => {
    setBusyId(post.id);
    await supabase.from('posts').update({ published: !post.published }).eq('id', post.id);
    setBusyId(null);
    load();
  };

  const remove = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    setBusyId(post.id);
    await supabase.from('posts').delete().eq('id', post.id);
    setBusyId(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-[#E6DECD]">Posts</h1>
        <Link
          to="/admin/new"
          className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-ink"
          style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
        >
          New post
        </Link>
      </div>

      <div className="mt-8 divide-y divide-[#767F83]/15 border-y border-[#767F83]/15">
        {posts === null && <p className="py-6 text-sm text-[#767F83]">Loading…</p>}
        {posts?.length === 0 && <p className="py-6 text-sm text-[#767F83]">No posts yet — create your first one.</p>}
        {posts?.map((post) => (
          <div key={post.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div className="min-w-0">
              <p className="truncate text-sm text-[#E6DECD]">{post.title}</p>
              <p className="text-xs text-[#767F83]">
                {post.published ? 'Published' : 'Draft'} ·{' '}
                {new Date(post.published_at).toLocaleDateString('en-IN')}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs uppercase tracking-widest">
              <button
                disabled={busyId === post.id}
                onClick={() => togglePublished(post)}
                className="text-[#767F83] hover:text-[#E6DECD] disabled:opacity-50"
              >
                {post.published ? 'Unpublish' : 'Publish'}
              </button>
              <Link to={`/admin/edit/${post.id}`} className="text-[#C6A15B] hover:text-[#E4CFA0]">
                Edit
              </Link>
              <button
                disabled={busyId === post.id}
                onClick={() => remove(post)}
                className="text-[#B6421D] hover:text-[#d15330] disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
