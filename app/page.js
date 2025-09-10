"use client";

import { useRef, useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import About from "./section/about";
import Kebijakan from "./section/kebijakan";
import NewsSection from "./section/news";
import SocialSection from "./section/socialmedia";
import Footer from "./components/footer";
import DireksiSection from "./section/DireksiSection";
import LoadingSpinner from "./components/LoadingSpinner";
import './globals.css';

export default function HomePage() {
  const router = useRouter();
  const container = useRef(null);
  const stickyMask = useRef(null);
  const aboutSection = useRef(null);
  const kebijakanSection = useRef(null);
  const movingBanner = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [isTopSection, setIsTopSection] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const position = useRef(0);
  const speed = 0.5;

  const imageSources = [
    "/image/BG-GSG.JPG",
    "/image/BCV-logo.png",
    "/image/GGW-logo.png",
    "/image/IMG_0149.png",
    "/image/Mustikarasa_logo.png",
    "/image/Logo-Pupuk-Indonesia.png",
    "/image/Logo-Petro.png",
    "/image/GSG-kecil.png",
  ];

  useEffect(() => {
    setIsClient(true);

    const preloadImages = () => {
      const promises = imageSources.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        });
      });
      return Promise.all(promises);
    };

    const loadResources = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        await preloadImages();
        setIsLoading(false);
      } catch (error) {
        console.warn("Some resources failed to load, hiding spinner anyway:", error);
        setIsLoading(false);
      }
    };

    const fallbackTimeout = setTimeout(() => {
      console.log("Loading fallback triggered after 10s");
      setIsLoading(false);
    }, 10000);

    loadResources();

    return () => {
      clearTimeout(fallbackTimeout);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScrollTopButton);
    };
  }, []);

  useEffect(() => {
    if (!isLoading && isClient) {
      requestAnimationFrame(animate);
      window.addEventListener("scroll", handleScroll);
      window.addEventListener("scroll", handleScrollTopButton);
      requestAnimationFrame(animateBanner);

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("scroll", handleScrollTopButton);
      };
    }
  }, [isLoading, isClient]);

  useEffect(() => {
    if (typeof window === "undefined" || isLoading) return;

    const handleHashChangeAndInitialScroll = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    };

    handleHashChangeAndInitialScroll();
    window.addEventListener('hashchange', handleHashChangeAndInitialScroll);

    return () => {
      window.removeEventListener('hashchange', handleHashChangeAndInitialScroll);
    };
  }, [isLoading]);

  const animate = () => {
    if (stickyMask.current && container.current) {
      const maskSizeProgress = 30 * getScrollProgress();
      stickyMask.current.style.webkitMaskSize =
        100 * (0.8 + maskSizeProgress) + "%";
    }
    requestAnimationFrame(animate);
  };

  const getScrollProgress = () => {
    if (!container.current || !stickyMask.current) return 0;
    const totalScrollHeight =
      container.current.getBoundingClientRect().height - window.innerHeight;
    return (
      stickyMask.current.offsetTop /
      Math.max(totalScrollHeight, window.innerHeight)
    );
  };

  const scrollToSection = () => {
    if (aboutSection.current) {
      const aboutTop = aboutSection.current.offsetTop;
      const windowHeight = window.innerHeight;
      const targetScroll = aboutTop - windowHeight / 1.1;
      window.scrollTo({
        top: targetScroll < 0 ? 0 : targetScroll,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const aboutTarget = aboutSection.current?.offsetTop ?? 0;
    setShowButton(scrollY + window.innerHeight < aboutTarget);
    setIsTopSection(scrollY < aboutTarget - 100);
  };

  const handleScrollTopButton = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    setShowScrollTop(scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    router.push("/");
  };

  const animateBanner = () => {
    if (movingBanner.current) {
      position.current -= speed;
      const width = movingBanner.current.scrollWidth / 2;
      if (position.current <= -width) {
        position.current = 0;
      }
      movingBanner.current.style.transform = `translateX(${position.current}px)`;
    }
    requestAnimationFrame(animateBanner);
  };

  if (!isClient) return null;
  if (isLoading) return <LoadingSpinner />;

  return (
    <main className={styles.main}>
      <Navigation />
      <div
        ref={container}
        className={styles.container}
        onClick={scrollToSection}
        style={{
          cursor: isTopSection ? "url('/icons/down.png') 12 12, auto" : "auto",
          paddingBottom: "0",
          marginBottom: "0",
        }}
      >
        <div className={styles.stars}></div>
        <div ref={stickyMask} className={styles.stickyMask}>
          <img
            src="/image/BG-GSG.JPG"
            alt="Nature"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
      <div
        style={{
          marginTop: "-175px",
          marginBottom: "-100px",
          zIndex: 2,
          position: "relative",
        }}
      >
        <DireksiSection />
      </div>
      <div
        ref={aboutSection}
        id="about"
        style={{
          paddingTop: "80px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <About />
      </div>
      <section
        className={styles.bannerSection}
        style={{
          margin: "0",
          padding: "20px 0",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <div ref={movingBanner} className={styles.movingBanner}>
          {[
            "/image/BCV-logo.png",
            "/image/GGW-logo.png",
            "/image/IMG_0149.png",
            "/image/Mustikarasa_logo.png",
            "/image/Logo-Pupuk-Indonesia.png",
            "/image/Logo-Petro.png",
            "/image/GSG-kecil.png",
          ].map((src, index) => (
            <div
              key={`first-${index}`}
              className={styles.logoContainer}
              style={{
                flexShrink: 0,
                width:
                  src.includes("IMG_0149") ||
                  src.includes("Logo-Pupuk-Indonesia")
                    ? "clamp(120px, 18%, 200px)"
                    : "clamp(80px, 12%, 160px)",
                height: "120px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={src}
                alt={`Moving Banner ${index + 1}`}
                style={{
                  height:
                    src.includes("IMG_0149") ||
                    src.includes("Logo-Pupuk-Indonesia")
                      ? "50px"
                      : "80px",
                  width: "auto",
                  maxWidth: src.includes("Logo-Pupuk-Indonesia")
                    ? "300px"
                    : "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                draggable={false}
              />
            </div>
          ))}
          {[
            "/image/BCV-logo.png",
            "/image/GGW-logo.png",
            "/image/IMG_0149.png",
            "/image/Mustikarasa_logo.png",
            "/image/Logo-Pupuk-Indonesia.png",
            "/image/Logo-Petro.png",
          ].map((src, index) => (
            <div
              key={`second-${index}`}
              className={styles.logoContainer}
              style={{
                flexShrink: 0,
                width:
                  src.includes("IMG_0149") ||
                  src.includes("Logo-Pupuk-Indonesia")
                    ? "clamp(120px, 18%, 200px)"
                    : "clamp(80px, 12%, 160px)",
                height: "120px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={src}
                alt={`Moving Banner Copy ${index + 1}`}
                style={{
                  height:
                    src.includes("IMG_0149") ||
                    src.includes("Logo-Pupuk-Indonesia")
                      ? "50px"
                      : "80px",
                  width: "auto",
                  maxWidth: src.includes("Logo-Pupuk-Indonesia")
                    ? "300px"
                    : "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </section>
      <div
        ref={kebijakanSection}
        id="kebijakan"
        style={{
          paddingTop: "5px",
          marginBottom: "0",
          scrollMarginTop: "50px",
        }}
      >
        <Kebijakan />
      </div>
      {showButton && (
        <div
          className="position-absolute bottom-0 start-50 translate-middle-x mb-5 text-center"
          style={{ zIndex: 10 }}
        >
          <p className="text-light mb-2 fw-semibold">Tekan untuk lanjut</p>
          <button
            onClick={scrollToSection}
            aria-label="Scroll ke bawah"
            style={{
              background: "none",
              border: "none",
              fontSize: "2rem",
              color: "white",
              animation: "bounce 2s infinite",
              cursor: "pointer",
            }}
          >
            ↓
          </button>
        </div>
      )}
      {showScrollTop && (
        <button
          aria-label="Scroll to top"
          onClick={scrollToTop}
          className="scroll-top-btn"
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#0d6efd",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(13, 110, 253, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#084cd9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#0d6efd";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M12 4l-8 8h6v8h4v-8h6z" />
          </svg>
        </button>
      )}
      <div id="news" style={{ paddingTop: "0px", marginBottom: "0" }}>
        <NewsSection />
      </div>
      <div id="medsos" style={{ paddingTop: "0px", marginBottom: "0" }}>
        <SocialSection />
      </div>
      <Footer />
    </main>
  );
}