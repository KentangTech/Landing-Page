import { notFound } from 'next/navigation';
import '@/app/globals.css';
import Footer from '@/app/components/footer';
import RelatedNews from './RelatedNews';
import Navigation from '@/app/components/NavigationALT';

interface NewsItem {
  id: number;
  judul: string;
  deskripsi?: string;
  content?: string;
  gambar?: string;
  category?: string;
  created_at?: string;
  date?: string;
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/news`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];

    const newsList: NewsItem[] = await res.json();

    return newsList
      .filter(item => item?.judul)
      .map(item => ({
        slug: generateSlug(item.judul),
      }));
  } catch (error) {
    console.error('Gagal generate static params:', error);
    return [];
  }
}

function generateSlug(judul: string): string {
  return judul
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let news: NewsItem | null = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/news/${slug}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error(`API responded with status: ${res.status}`);
    }

    news = await res.json();
  } catch (error) {
    console.error('Error fetching news detail:', error);
    notFound();
  }

  if (!news) {
    notFound();
  }

  const formattedDate = new Date(news.created_at || news.date || Date.now())
    .toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const gambarUrl = news.gambar
    ? news.gambar.startsWith('http')
      ? news.gambar
      : news.gambar.startsWith('/')
        ? `${process.env.NEXT_PUBLIC_LARAVEL_API || ''}${news.gambar}`
        : `${process.env.NEXT_PUBLIC_LARAVEL_API || ''}/${news.gambar}`
    : '/gambars/placeholder.jpg';

  return (
    <>
      <Navigation />
      <section style={{
        backgroundColor: 'white',
        padding: '100px 20px',
        color: '#222',
        minHeight: '100vh',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 20px',
        }}>
          <div style={{
            width: '100%',
            height: '400px',
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#f8f9fa',
            marginBottom: '2rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            position: 'relative',
          }}>
            <img
              src={gambarUrl}
              alt={news.judul}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/gambars/placeholder.jpg';
              }}
            />
          </div>

          <div style={{
            fontSize: '0.85rem',
            fontWeight: '700',
            marginBottom: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#0a1e3a',
            padding: '0.35rem 1rem',
            borderRadius: '30px',
            display: 'inline-block',
            backgroundColor: 'rgba(10, 30, 58, 0.08)',
            border: '1px solid rgba(10, 30, 58, 0.15)',
          }}>
            {news.category || 'Berita'}
          </div>

          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: '800',
            marginBottom: '1rem',
            color: '#1a1a1a',
            lineHeight: 1.3,
            letterSpacing: '-0.5px',
          }}>
            {news.judul}
          </h1>

          <p style={{
            fontSize: '0.95rem',
            color: '#666',
            marginBottom: '2.5rem',
            fontWeight: '500',
          }}>
            {formattedDate}
          </p>

          <div style={{
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: '#333',
            marginBottom: '4rem',
            padding: '2rem',
            borderRadius: '16px',
            backgroundColor: '#fafafa',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.03)',
          }} dangerouslySetInnerHTML={{
            __html: news.content || news.deskripsi || '<p>Belum ada konten.</p>',
          }} />

          <RelatedNews currentSlug={slug} />
        </div>
      </section>
      <Footer />
    </>
  );
}