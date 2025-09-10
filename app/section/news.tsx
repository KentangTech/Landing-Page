"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/app/css/NewsSection.module.css";

interface NewsItem {
  id: number;
  judul: string;
  deskripsi: string;
  update_time: string;
  category: string;
  uploaded_by: string;
  image: string;
  created_at: string;
}

export default function NewsSection() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredButton, setHoveredButton] = useState<boolean>(false);
  const [hoveredReadMore, setHoveredReadMore] = useState<number | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/data/news");
        if (!res.ok) throw new Error(`HTTP ${res.status}: Gagal memuat data`);

        const rawData = await res.json();
        const newsArray = Array.isArray(rawData) ? rawData : rawData?.data || [];

        const sortedNews = [...newsArray].sort((a, b) => {
          const dateA = new Date(a.created_at || a.update_time || 0).getTime();
          const dateB = new Date(b.created_at || b.update_time || 0).getTime();
          return dateB - dateA;
        });

        const formatted: NewsItem[] = sortedNews.map((item: any) => {
          const createdAt = item.created_at || item.update_time || new Date().toISOString();
          const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return {
            id: item.id || Math.random(),
            judul: item.judul || "Untitled",
            deskripsi:
              item.deskripsi ||
              item.desc ||
              (item.content ? item.content.substring(0, 120) + "..." : "No description available."),
            update_time: formattedDate,
            category: item.category || "Uncategorized",
            uploaded_by: item.uploaded_by || item.author || "Admin",
            image: item.image
              ? item.image.startsWith("http")
                ? item.image
                : item.image.startsWith("/")
                ? `${process.env.NEXT_PUBLIC_LARAVEL_API || ""}${item.image}`
                : `${process.env.NEXT_PUBLIC_LARAVEL_API || ""}/${item.image}`
              : "/images/placeholder.jpg",
            created_at: createdAt,
          };
        });

        setNewsData(formatted);
      } catch (error) {
        console.error("Gagal memuat berita dari API:", error);
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const NewsCard = ({ news }: { news: NewsItem }) => (
    <article
      className={`${styles.newsCard} ${hoveredCard === news.id ? styles.newsCardHover : ""}`}
      onMouseEnter={() => setHoveredCard(news.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className={styles.imageContainer}>
        <img
          src={news.image}
          alt={news.judul}
          className={`${styles.newsImage} ${hoveredCard === news.id ? styles.imageHover : ""}`}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
          }}
        />
        <span
          className={`${styles.categoryBadge} ${
            styles[news.category.toLowerCase().replace(/\s+/g, '')] || styles.defaultCategory
          }`}
        >
          {news.category}
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.update_time}>{news.update_time}</span>
          <span className={styles.uploadedByBadge}>
            By {news.uploaded_by}
          </span>
        </div>

        <h3 className={styles.newsTitle}>{news.judul}</h3>
        <p className={styles.deskripsi}>{news.deskripsi}</p>

        <button
          className={`${styles.readMore} ${
            hoveredReadMore === news.id ? styles.readMoreHover : ""
          }`}
          onMouseEnter={() => setHoveredReadMore(news.id)}
          onMouseLeave={() => setHoveredReadMore(null)}
        >
          Read More →
        </button>
      </div>
    </article>
  );

  if (loading) {
    return (
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <p>Loading news...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.newsSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.judul}>Latest News</h2>
          <p className={styles.subjudul}>Stay up-to-date with our latest stories and insights</p>
        </div>

        <div className={styles.newsGrid}>
          {newsData.length > 0 ? (
            newsData.slice(0, 6).map((news) => <NewsCard key={news.id} news={news} />)
          ) : (
            <p className={styles.noNews}>No news available</p>
          )}
        </div>

        <div className={styles.viewAllContainer}>
          <Link href="/news">
            <button
              className={`${styles.viewAllButton} ${
                hoveredButton ? styles.viewAllButtonHover : ""
              }`}
              onMouseEnter={() => setHoveredButton(true)}
              onMouseLeave={() => setHoveredButton(false)}
            >
              View All News
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}