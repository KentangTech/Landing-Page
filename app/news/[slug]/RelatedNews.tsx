import { getJsonData } from "@/lib/api";
import { generateSlug } from "@/lib/utils";
import Link from "next/link";
import styles from "@/app/css/RelatedNews.module.css";

interface NewsItem {
  id: number;
  title: string;
  image?: string;
  category?: string;
  readTime?: string;
  "read-time"?: string;
}

interface RelatedNewsProps {
  currentSlug: string;
}

export default async function RelatedNews({ currentSlug }: RelatedNewsProps) {
  const data = await getJsonData("news");
  const newsList = Array.isArray(data) ? data : data?.data || [];

  const related = newsList
    .filter((item: NewsItem) => generateSlug(item.title) !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <div className={styles.relatedContainer}>
      <h3 className={styles.relatedTitle}>Berita Lainnya</h3>
      <div className={styles.relatedGrid}>
        {related.map((item: NewsItem) => {
          const slug = generateSlug(item.title);
          return (
            <Link key={item.id} href={`/news/${slug}`} className={styles.relatedCard}>
              <img
                src={item.image || "/images/placeholder.jpg"}
                alt={item.title}
                className={styles.relatedImage}
              />
              <h4 className={styles.relatedCardTitle}>{item.title}</h4>
              <p className={styles.relatedMeta}>
                {item.category || "Uncategorized"} • {item.readTime || item["read-time"] || "5 min read"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}