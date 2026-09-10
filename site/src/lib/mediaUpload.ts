import { supabase } from './supabase';

function extFromName(name: string): string {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i) : '';
}

export async function uploadToSiteMedia(file: File | Blob, pathPrefix: string, filename = 'file'): Promise<string> {
  const ext = file instanceof File ? extFromName(file.name) : '.jpg';
  const path = `${pathPrefix}/${crypto.randomUUID()}-${filename}${ext}`;
  const { error } = await supabase.storage.from('site-media').upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from('site-media').getPublicUrl(path);
  return data.publicUrl;
}

// A non-technical founder shouldn't have to also produce a thumbnail for
// every clip they upload — grab a frame straight out of the video file
// itself, client-side, entirely in the browser.
export function captureVideoPoster(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => URL.revokeObjectURL(url);

    video.addEventListener('loadeddata', () => {
      video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
    });
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        cleanup();
        reject(new Error('Canvas not supported'));
        return;
      }
      ctx.drawImage(video, 0, 0);
      canvas.toBlob(
        (blob) => {
          cleanup();
          if (blob) resolve(blob);
          else reject(new Error('Could not capture a poster frame from this video'));
        },
        'image/jpeg',
        0.85,
      );
    });
    video.addEventListener('error', () => {
      cleanup();
      reject(new Error('Could not read this video file'));
    });
    video.load();
  });
}
