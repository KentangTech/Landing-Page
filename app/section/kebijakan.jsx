"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "../css/kebijakan.module.css";

const kebijakanData = [
  {
    id: 1,
    title: "Kebijakan Mutu",
    image: "/kebijakan/kebijakan_mutu.png",
    desc: `PT Graha Sarana Gresik menetapkan kebijakan mutu ini sebagai bagian dari komitmen kami untuk menyediakan layanan berkualitas tinggi dalam rangka mencapai visi kami sebagai perusahaan yang unggul dan berdaya saing tinggi yang berkelanjutan serta menjalankan misi kami dalam usaha catering/restoran, laundry dan cleaning service yang kompetitif dengan menjaga keunggulan mutu serta menjaga keseimbangan lingkungan.`,
  },
  {
    id: 2,
    title: "Kebijakan Lingkungan",
    image: "/kebijakan/kebijakan_lingkungan.png",
    desc: `PT Graha Sarana Gresik berkomitmen untuk menjalankan operasi bisnis yang bertanggung jawab terhadap lingkungan. Kami menerapkan sistem manajemen lingkungan berkelanjutan dan praktik terbaik demi masa depan bumi.`,
  },
  {
    id: 3,
    title: "Kebijakan Keamanan Pangan",
    image: "/kebijakan/kebijakan_keamanan_pangan.png",
    desc: `Manajemen puncak PT Graha Sarana Gresik berkomitmen penuh menerapkan sistem keamanan pangan sesuai ISO 22000:2018. Seluruh karyawan diajak aktif menjaga standar ini demi kesehatan dan keselamatan konsumen.`,
  },
];

export default function Kebijakan() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState("next");
  const [modalImage, setModalImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const current = kebijakanData[activeIndex];

  const handlePrev = () => {
    setDirection("prev");
    setTimeout(() => {
      setActiveIndex((prev) =>
        prev === 0 ? kebijakanData.length - 1 : prev - 1
      );
    }, 50);
  };

  const handleNext = () => {
    setDirection("next");
    setTimeout(() => {
      setActiveIndex((prev) =>
        prev === kebijakanData.length - 1 ? 0 : prev + 1
      );
    }, 50);
  };

  const openModal = () => {
    setModalImage(current.image);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalImage(null);
    document.body.style.overflow = "";
  };

  const handleWheel = (e) => {
    e.preventDefault();
    let newScale = scale - e.deltaY * 0.001;
    newScale = Math.min(Math.max(newScale, 1), 3);
    setScale(newScale);
    if (newScale === 1) setPosition({ x: 0, y: 0 });
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      setStartPos({
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      });
    } else if (e.touches.length === 1 && scale > 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setStartPos({
        x: touch.clientX - position.x,
        y: touch.clientY - position.y,
      });
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2) {
      const [a, b] = e.touches;
      const currentDist = Math.hypot(
        a.clientX - b.clientX,
        a.clientY - b.clientY
      );
      const newScale = scale * (currentDist / startPos.dist);
      setScale(Math.min(Math.max(newScale, 1), 3));
      startPos.dist = currentDist;
      if (newScale <= 1) setPosition({ x: 0, y: 0 });
    } else if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - startPos.x,
        y: touch.clientY - startPos.y,
      });
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <section
      id="kebijakan"
      className={`py-5 bg-light ${styles.sectionWrapper}`}
      style={{ scrollMarginTop: "80px" }}
    >
      {/* Header */}
      <div className="container text-center mb-5">
        <h2 className="fw-bold">Kebijakan</h2>
        <p className="text-muted fs-5 mx-auto" style={{ maxWidth: 600 }}>
          Kami berkomitmen menjaga kualitas layanan dan transparansi dalam setiap kebijakan.
        </p>
      </div>

      {/* Container Utama */}
      <div className="container d-flex justify-content-center position-relative">
        <div className={styles.slideContainer}>
          <div
            key={activeIndex}
            className={`${styles.card} ${
              direction === "next"
                ? styles.slideInFromRight
                : direction === "prev"
                ? styles.slideInFromLeft
                : ""
            }`}
            style={{
              transition: "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            {/* Gambar dengan Zoom */}
            <div
              className={styles.imageWrapper}
              onClick={openModal}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openModal();
              }}
              role="button"
              tabIndex={0}
              aria-label="Zoom gambar"
              style={{
                cursor: "zoom-in",
                flexShrink: 0,
                width: "320px",
                height: "300px",
              }}
            >
              <Image src={current.image} alt={current.title} fill />
            </div>

            {/* Deskripsi Kebijakan */}
            <div className={styles.textWrapper}>
              <h3>{current.title}</h3>
              <p>{current.desc}</p>
            </div>
          </div>
        </div>

        {/* Tombol Navigasi Mobile */}
        {isMobile && (
          <div className={styles.mobileNavButtons}>
            <button onClick={handlePrev} aria-label="Sebelumnya">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button onClick={handleNext} aria-label="Berikutnya">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}

        {/* Tombol Navigasi Desktop */}
        {!isMobile && (
          <>
            <button className={styles.prevButton} onClick={handlePrev} aria-label="Sebelumnya">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className={styles.nextButton} onClick={handleNext} aria-label="Berikutnya">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Modal Zoom Gambar */}
      {modalImage && (
        <div
          className={styles.modalBackdrop}
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Zoom Gambar"
          ref={modalRef}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transition: isDragging ? "none" : "transform 0.1s ease-out",
              cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-out",
            }}
          >
            <img
              src={modalImage}
              alt="Gambar Kebijakan"
              draggable="false"
              style={{
                width: "auto",
                height: "auto",
                maxWidth: "90vw",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/kebijakan/image-not-found.png";
              }}
            />
          </div>
          <button className={styles.modalCloseButton} onClick={closeModal} aria-label="Tutup Modal">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}