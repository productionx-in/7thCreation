import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase, type Post } from '@/lib/supabase';
import { slugify } from '@/lib/slugify';

const fieldClass =
  'w-full rounded-lg border border-[#767F83]/30 bg-transparent px-4 py-2.5 text-sm text-[#E6DECD] ' +
  'placeholder:text-[#767F83] focus:border-[#C6A15B] focus:outline-none';

export function AdminPostEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [published, setPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(isNew);

  useEffect(() => {
    if (isNew) return;
    supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }: { data: Post | null }) => {
        if (!data) return;
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt);
        setContent(data.content);
        setTags(data.tags.join(', '));
        setCoverUrl(data.cover_image_url ?? '');
        setPublished(data.published);
        setLoaded(true);
      });
  }, [id, isNew]);

  useEffect(() => {
    if (isNew && !slugTouched) setSlug(slugify(title));
  }, [title, isNew, slugTouched]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('blog-images').upload(path, file);
    setUploading(false);
    if (uploadError) {
      setError('Image upload failed: ' + uploadError.message);
      return;
    }
    const { data } = supabase.storage.from('blog-images').getPublicUrl(path);
    setCoverUrl(data.publicUrl);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title,
      slug: slugify(slug),
      excerpt,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      cover_image_url: coverUrl || null,
      published,
    };

    const { error: saveError } = isNew
      ? await supabase.from('posts').insert(payload)
      : await supabase.from('posts').update(payload).eq('id', id);

    setSaving(false);
    if (saveError) {
      setError(saveError.message.includes('duplicate') ? 'That slug is already used by another post.' : saveError.message);
      return;
    }
    navigate('/admin');
  };

  if (!loaded) return <p className="text-sm text-[#767F83]">Loading…</p>;

  return (
    <div>
      <h1 className="font-display text-2xl text-[#E6DECD]">{isNew ? 'New post' : 'Edit post'}</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <input
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${fieldClass} font-display text-lg`}
        />

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-[#767F83]">URL slug</span>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className={fieldClass}
          />
        </label>

        <textarea
          required
          placeholder="Short excerpt (shows on the blog listing)"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className={`${fieldClass} resize-none`}
        />

        <input
          placeholder="Tags, comma separated (e.g. Gear, Weddings)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className={fieldClass}
        />

        <label className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-widest text-[#767F83]">Cover image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            className="text-sm text-[#767F83] file:mr-3 file:rounded-full file:border-0 file:bg-[#C6A15B]/15 file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-[#C6A15B]"
          />
          {uploading && <span className="text-xs text-[#767F83]">Uploading…</span>}
          {coverUrl && <img src={coverUrl} alt="Cover preview" className="mt-2 h-40 rounded-lg object-cover" />}
        </label>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-[#767F83]">
              Content (Markdown — # headings, **bold**, - lists, ![alt](image url))
            </span>
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="text-xs uppercase tracking-widest text-[#C6A15B] hover:text-[#E4CFA0]"
            >
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
          {showPreview ? (
            <div className="prose-blog rounded-lg border border-[#767F83]/30 p-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '*Nothing yet.*'}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className={`${fieldClass} resize-y font-mono text-xs leading-relaxed`}
            />
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-[#E6DECD]">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Published (visible on the site)
        </label>

        {error && <p className="text-xs text-[#B6421D]">{error}</p>}

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center justify-center rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-ink disabled:opacity-60"
            style={{ background: 'linear-gradient(123deg, #E4CFA0 7%, #C6A15B 45%, #8F723D 72%, #B6421D 100%)' }}
          >
            {saving ? 'Saving…' : 'Save post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="text-xs uppercase tracking-widest text-[#767F83] hover:text-[#E6DECD]"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
