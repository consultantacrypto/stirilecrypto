import { DANIEL_YOUTUBE_CHANNEL_URL, homepageYoutubeEmbedId } from '@/lib/youtube';

export default function HomeYoutube() {
  const videoId = homepageYoutubeEmbedId();

  return (
    <section aria-label="Video Daniel Mihai" className="mt-6">
      {videoId ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
          <iframe
            title="Video Daniel Mihai"
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="text-sm text-slate-400">
          <a
            href={DANIEL_YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline decoration-white/30 underline-offset-4"
          >
            YouTube, Daniel Mihai
          </a>
        </p>
      )}
    </section>
  );
}
