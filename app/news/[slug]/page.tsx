import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import '@/app/globals.css';

import Footer from '@/app/components/footer';
import RelatedNews from './RelatedNews';
import Navigation from '@/app/components/NavigationALT';

const NEWS_JSON_PATH = path.join(process.cwd(), 'public', 'data-json', 'news.json');

interface NewsItem {
  judul: string;
  deskripsi?: string;
  content?: string;
  gambar?: string;
  category?: string;
  created_at?: string;
  date?: string;
}

function getNewsData(): NewsItem[] {
  try {
    if (!fs.existsSync(NEWS_JSON_PATH)) {
      console.error('❌ File tidak ditemukan:', NEWS_JSON_PATH);
      return [];
    }

    const fileContent = fs.readFileSync(NEWS_JSON_PATH, 'utf-8');
    const data = JSON.parse(fileContent);

    const newsList = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

    if (!Array.isArray(newsList)) {
      console.error('❌ Format data tidak valid');
      return [];
    }

    return newsList.filter(item => 
      item && typeof item.judul === 'string' && item.judul.trim() !== ''
    );
  } catch (error) {
    console.error('❌ Gagal baca news.json:', error);
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

export async function generateStaticParams() {
  const newsList = getNewsData();
  return newsList.map(item => ({
    slug: generateSlug(item.judul),
  }));
}

// Halaman Detail
export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const newsList = getNewsData();
  const news = newsList.find(item => generateSlug(item.judul) === slug);

  if (!news) {
    return notFound();
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
          <a 
            href="/news" 
            style={{
              marginBottom: '1.5rem',
              display: 'inline-block',
              backgroundColor: '#0a1e3a',
              color: 'white',
              border: 'none',
              padding: '0.65rem 1.5rem',
              borderRadius: '30px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(10, 30, 58, 0.25)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(10, 30, 58, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(10, 30, 58, 0.25)';
            }}
          >
            ← Kembali
          </a>

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