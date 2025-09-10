"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../components/NavigationALT";
import Footer from "../components/footer";
import styles from "@/app/css/NewsPage.module.css";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  created_at: string;
}

interface CustomCategoryDropdownProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CustomCategoryDropdown = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CustomCategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.customDropdown}>
      <div className={styles.dropdownHeader} onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedCategory}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}>
          ▼
        </span>
      </div>
      <div className={styles.dropdownListContainer}>
        <ul className={`${styles.dropdownList} ${isOpen ? styles.open : ""}`}>
          {categories.map((category) => (
            <li
              key={category}
              className={`${styles.dropdownItem} ${
                selectedCategory === category ? styles.dropdownItemSelected : ""
              }`}
              onClick={() => {
                onSelectCategory(category);
                setIsOpen(false);
              }}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default function NewsPage() {
  const router = useRouter();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const newsPerPage = 6;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/data/news");
        if (!res.ok) throw new Error(`HTTP ${res.status}: Gagal memuat data berita`);

        const rawData = await res.json();
        const list = Array.isArray(rawData) ? rawData : rawData?.data || [];

        const formatted = list.map((item: any) => {
          const createdAt =
            item.created_at || item.date || new Date().toISOString();
          const date = new Date(createdAt).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          return {
            id: item.id || Math.random(),
            title: item.title || "Tanpa Judul",
            excerpt: item.excerpt || "Tidak ada ringkasan.",
            image: item.image || "/images/placeholder.jpg",
            category: item.category || "Uncategorized",
            created_at: createdAt,
            date,
            readTime: item.readTime || item.read_time || "5 min read",
          };
        });

        setNewsList(formatted);
      } catch (error) {
        console.error("Gagal muat berita:", error);
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const categories: string[] = [
    "All",
    ...new Set(newsList.map((n) => n.category)),
  ];

  const filteredNews = newsList.filter((news) => {
    const matchesCategory =
      selectedCategory === "All" || news.category === selectedCategory;
    const matchesSearch =
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleNewsClick = (title: string, id: number) => {
    const slug = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]/g, "");
    router.push(`/news/${id}-${slug}`);
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className={styles.main}>
          <section className={styles.newsSection}>
            <div className={styles.container}>
              <LoadingSpinner />
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className={styles.main}>
        <section className={styles.newsSection}>
          <div className={styles.container}>
            <div className={styles.header}>
              <h1 className={styles.modernTitle}>
                <span className={styles.titleHighlight}>Latest</span> News &
                Insights
              </h1>
              <p className={styles.subtitle}>
                Stay updated with our latest stories and industry insights
              </p>
            </div>

            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.categoryDropdown}>
              <CustomCategoryDropdown
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(category) => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className={styles.contentLayout}>
              <div className={styles.sidebar}>
                <h3 className={styles.sidebarTitle}>Categories</h3>
                <div className={styles.categoryList}>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className={`${styles.categoryButton} ${
                        selectedCategory === category
                          ? styles.activeCategory
                          : ""
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.newsContent}>
                <div className={styles.newsGrid}>
                  {currentNews.length === 0 ? (
                    <p className={styles.noResults}>
                      Tidak ada berita yang ditemukan.
                    </p>
                  ) : (
                    currentNews.map((news) => (
                      <article
                        key={news.id}
                        className={styles.newsCard}
                        onClick={() => handleNewsClick(news.title, news.id)}
                      >
                        <div className={styles.imageContainer}>
                          <img
                            src={news.image}
                            alt={news.title}
                            className={styles.newsImage}
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                            }}
                          />
                          <div className={styles.uploadedByBadge}>
                            Uploaded By: Admin
                          </div>
                        </div>
                        <div className={styles.cardContent}>
                          <span
                            className={`${styles.categoryBadge} ${
                              styles[news.category.toLowerCase().replace(/\s+/g, '')] || ""
                            }`}
                          >
                            {news.category}
                          </span>
                          <h3 className={styles.newsTitle}>{news.title}</h3>
                          <div className={styles.metaInfo}>
                            <span className={styles.date}>{news.date}</span>
                            <span className={styles.readTime}>
                              {news.readTime}
                            </span>
                          </div>
                          <p className={styles.excerpt}>{news.excerpt}</p>
                          <button className={styles.readMoreButton}>
                            Read More →
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>

                {totalPages > 1 && (
                  <div className={styles.paginationContainer}>
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      className={`${styles.paginationButton} ${
                        currentPage === 1 ? styles.disabledButton : ""
                      }`}
                    >
                      ← Previous
                    </button>
                    <div className={styles.paginationInfo}>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <span>•</span>
                      <span>{filteredNews.length} articles found</span>
                    </div>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`${styles.paginationButton} ${
                        currentPage === totalPages ? styles.disabledButton : ""
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}