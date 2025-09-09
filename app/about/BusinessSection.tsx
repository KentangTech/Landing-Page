"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import style from "@/app/css/BusinessSection.module.css";

interface BisnisItem {
  title: string;
  desc: string;
  image: string;
  tag?: string;
}

function truncateDescHalf(text: string, percentage = 0.5): string {
  const cleanText = text.replace(/<[^>]*>/g, "").trim();
  const length = cleanText.length;

  if (length <= 100) return cleanText;

  const targetLength = Math.floor(length * percentage);
  let cutIndex = targetLength;

  const nextPeriod = cleanText.indexOf(". ", cutIndex);
  if (nextPeriod !== -1 && nextPeriod < length) {
    cutIndex = nextPeriod + 1;
  } else {
    const nextSpace = cleanText.lastIndexOf(" ", targetLength);
    cutIndex = nextSpace > 50 ? nextSpace : targetLength;
  }

  const truncated = cleanText.slice(0, cutIndex).trim();
  return truncated + (cutIndex < length ? "..." : "");
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

export default function BusinessSection() {
  const [data, setData] = useState<BisnisItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBisnis = async () => {
      try {
        const res = await fetch('/data-json/bisnis.json');
        if (!res.ok) throw new Error('Gagal memuat data bisnis');

        const json = await res.json();
        const list = Array.isArray(json) ? json : json?.data || [];

        const formatted = list.map((item: any) => ({
          title: item.title || "Tanpa Judul",
          desc: item.desc || item.description || "",
          image: item.image || "/images/placeholder.jpg",
          tag: item.tag || undefined,
        }));

        setData(formatted);
      } catch (error) {
        console.error("Gagal muat data bisnis:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBisnis();
  }, []);

  if (loading) {
    return (
      <section className="py-10 text-center">
        <p>Memuat data bisnis...</p>
      </section>
    );
  }

  if (data.length === 0) {
    return (
      <section className="py-10 text-center">
        <p className="text-danger">Tidak ada data bisnis tersedia.</p>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className={style.sectionContainer}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl fw-bold text-dark">
            Bisnis & <span style={{ color: "#0a1e3a" }}>Usaha</span>
          </h2>
          <p className="text-muted mt-3 fs-5 max-w-2xl mx-auto">
            Diversifikasi bisnis PT Graha Sarana Gresik untuk mendukung pertumbuhan berkelanjutan.
          </p>
        </div>

        <div className="row g-4">
          {data.map((item, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-3">
              <div className={`${style.cardContainer} card shadow-sm rounded-4 h-100`}>
                <div className={style.cardImage}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>
                <div className="card-body p-4">
                  <h6 className={`${style.cardTitle} fs-5`}>{item.title}</h6>
                  {item.tag && <span className={style.cardTag}>{item.tag}</span>}
                  <p className={style.cardDesc}>{truncateDescHalf(item.desc, 0.5)}</p>
                  <Link href={`/about/${generateSlug(item.title)}`} passHref>
                    <button className={style.cardButton} aria-label={`Lihat detail ${item.title}`}>
                      Lihat Detail
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}