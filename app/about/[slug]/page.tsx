import fs from 'fs';
import path from 'path';
import React from 'react';
import Footer from '@/app/components/footer';
import { notFound } from 'next/navigation';
import style from '@/app/css/AboutSlug.module.css';

const DATA_DIR = path.join(process.cwd(), 'public', 'data-json');
const BISNIS_FILE = path.join(DATA_DIR, 'bisnis.json');

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function readBisnisData() {
  try {
    const fileContent = fs.readFileSync(BISNIS_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error('Gagal baca bisnis.json:', error);
    return [];
  }
}

export async function generateStaticParams() {
  const data = readBisnisData();
  return data.map((item: { title: string }) => ({
    slug: generateSlug(item.title),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = readBisnisData();
  const item = data.find((d: any) => generateSlug(d.title) === slug);

  if (!item) {
    return { title: 'Detail Bisnis', description: 'Informasi detail bisnis.' };
  }

  return {
    title: item.title || 'Detail Bisnis',
    description:
      item.desc
        ? item.desc.replace(/<[^>]*>/g, '').substring(0, 160)
        : 'Informasi detail mengenai unit bisnis dari PT Graha Sarana Gresik.',
  };
}

export default async function BisnisDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = readBisnisData();
  const item = data.find((d: any) => generateSlug(d.title) === slug);

  if (!item) {
    return notFound();
  }

  return (
    <main className={style.mainContainer}>
      <div className={style.pageContainer}>
        <div className={style.backButtonContainer}>
          <a href="/about" className={style.backButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
            <span>Kembali ke About</span>
          </a>
        </div>

        <div className={style.detailWrapper}>
          <div className={style.imageWrapper}>
            <img src={item.image} alt={item.title} loading="lazy" />
          </div>
          <div className={style.textWrapper}>
            {item.tag && <span className={style.tag}>{item.tag}</span>}
            <h1 className={style.title}>{item.title}</h1>
            <div
              className={style.description}
              dangerouslySetInnerHTML={{ __html: item.desc }}
            />
          </div>
        </div>
      </div>

      <footer className={style.footer}>
        <Footer />
      </footer>
    </main>
  );
}