"use client";

import { useRef, useEffect, useState, RefObject } from "react";
import styles from "@/app/css/direksi.module.css";

interface DireksiMember {
  id: number;
  nama: string;
  posisi: string;
  foto_url: string | null;
  imageLoaded?: boolean;
  imageError?: boolean;
}

function useOnScreen(ref: RefObject<Element | null>): boolean {
  const [isIntersecting, setIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const current = ref.current;

    if (!current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(!!entry?.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(current);

    return () => {
      observer.unobserve(current);
    };
  }, [ref]);

  return isIntersecting;
}

export default function DireksiSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const [direksi, setDireksi] = useState<DireksiMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDireksi = async () => {
      try {
        setLoading(true);
        const res = await fetch("/data-json/direksi.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const rawData = await res.json();

        const dataArray = Array.isArray(rawData.data) ? rawData.data : rawData;
        if (!Array.isArray(dataArray)) {
          throw new Error("Format data direksi tidak valid");
        }

        const dataWithFlags = dataArray.map((d: any) => ({
          id: d.id || Math.random(),
          nama: d.nama?.trim() || "Nama Tidak Diketahui",
          posisi: d.posisi?.trim() || "Posisi Tidak Diketahui",
          foto_url: d.foto_url?.trim() || null,
          imageLoaded: false,
          imageError: false,
        }));

        setDireksi(dataWithFlags);
      } catch (error) {
        console.error("Gagal memuat data direksi.json:", error);
        setDireksi([]);
      } finally {
        setLoading(false);
      }
    };

    loadDireksi();
  }, []);

  const getDirekturByPosition = (keyword: string) =>
    direksi.find((d) => d.posisi?.toLowerCase().includes(keyword.toLowerCase()));

  const direkturUtama = getDirekturByPosition("utama");
  const direkturKeuangan = getDirekturByPosition("keuangan");
  const direkturOperasional = getDirekturByPosition("operasional");

  const orderedDireksi = [direkturOperasional, direkturUtama, direkturKeuangan].filter(
    (d): d is DireksiMember => Boolean(d)
  );

  const renderSkeletonCards = (keyPrefix: string) => (
    <div className={styles.cardContainer}>
      {[...Array(3)].map((_, idx) => (
        <div key={`${keyPrefix}-${idx}`} className={styles.card}>
          <div className={styles.circularCard}>
            <div className={styles.imageLoaderContainer}>
              <img src="/icons/data.gif" alt="Loading" className={styles.loaderGif} />
            </div>
          </div>
          <div className={styles.skeletonText}></div>
          <div className={styles.skeletonSubtext}></div>
        </div>
      ))}
    </div>
  );

  return (
    <section ref={ref} className={`${styles.direksiSection} ${isVisible ? styles.fadeIn : ""}`}>
      {loading ? (
        renderSkeletonCards("skeleton")
      ) : orderedDireksi.length === 0 ? (
        renderSkeletonCards("fallback")
      ) : (
        <div className={styles.cardContainer}>
          {orderedDireksi.map((person, idx) => (
            <div key={idx} className={`${styles.card} ${isVisible ? styles.isVisible : ""}`}>
              <div className={styles.circularCard}>
                {!person.imageLoaded && !person.imageError && (
                  <div className={styles.imageLoaderContainer}>
                    <img src="/icons/data.gif" alt="Loading" className={styles.loaderGif} />
                  </div>
                )}
                {person.imageError && (
                  <div className={styles.errorMessage}>Gambar tidak tersedia</div>
                )}
                {person.foto_url && !person.imageError && (
                  <img
                    src={person.foto_url}
                    alt={person.nama}
                    className={styles.personImage}
                    style={{
                      opacity: person.imageLoaded ? 1 : 0,
                      visibility: person.imageLoaded ? "visible" : "hidden",
                    }}
                    loading="lazy"
                    onLoad={() => {
                      setDireksi((prev) =>
                        prev.map((d) =>
                          d.id === person.id ? { ...d, imageLoaded: true, imageError: false } : d
                        )
                      );
                    }}
                    onError={() => {
                      setDireksi((prev) =>
                        prev.map((d) =>
                          d.id === person.id ? { ...d, imageError: true, imageLoaded: false } : d
                        )
                      );
                    }}
                  />
                )}
              </div>
              <h4 className="mb-1" style={{ fontWeight: "bold", color: "#222" }}>
                {person.posisi}
              </h4>
              <p className="text-muted" style={{ fontSize: "1.1rem" }}>
                {person.nama}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}