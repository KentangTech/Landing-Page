"use client";

import { useState, useEffect } from "react";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="position-fixed rounded-circle d-flex align-items-center justify-content-center"
          style={{
            right: "2rem",
            bottom: "2rem",
            width: "50px",
            height: "50px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontSize: "1.5rem",
            cursor: "pointer",
            zIndex: 1000,
            transition: "all 0.3s ease",
          }}
          aria-label="Kembali ke atas"
        >
          ↑
        </button>
      )}
    </>
  );
}