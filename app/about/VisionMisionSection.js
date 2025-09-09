"use client";

import { useState, useRef, useEffect } from "react";

export default function VisionMisionSection({ isVisible, openModal }) {
  const primaryBlue = "#0a1e3a";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const openZoomModal = () => {
    setIsModalOpen(true);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const closeZoomModal = () => {
    setIsModalOpen(false);
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(prev + delta, 1), 4));
  };

  useEffect(() => {
    if (zoom === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isModalOpen, isDragging, startPos]);

  return (
    <>
      <section className="py-5 bg-light">
        <div className="container px-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 order-2 col-md-12">
              <div
                className="rounded-4 overflow-hidden shadow-lg cursor-pointer"
                data-idx="2"
                onClick={openZoomModal}
                style={{
                  height: "300px",
                  backgroundColor: "#f8f9fa",
                  cursor: "zoom-in",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isModalOpen) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isModalOpen) {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)";
                  }
                }}
              >
                <img
                  src="/image/visi-&-misi.jpg"
                  alt="PT Graha Sarana Gresik"
                  className="w-100 h-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="col-lg-6 order-1 col-md-12">
              <div
                data-idx="3"
                style={{
                  opacity: isVisible["3"] ? 1 : 0,
                  transform: isVisible["3"] ? "translateX(0)" : "translateX(-20px)",
                  transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s",
                }}
              >
                <h2 className="fw-bold" style={{ color: primaryBlue }}>
                  Visi
                </h2>
                <p className="text-dark mt-3 fs-5">
                  Menjadi perusahaan yang sehat dan berkembang di bidang properti, angkutan, perdagangan, pergudangan, perkantoran, dan jasa bongkar muat.
                </p>
              </div>
              <div
                className="mt-5"
                data-idx="4"
                style={{
                  opacity: isVisible["4"] ? 1 : 0,
                  transform: isVisible["4"] ? "translateX(0)" : "translateX(-20px)",
                  transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
                }}
              >
                <h2 className="fw-bold" style={{ color: primaryBlue }}>
                  Misi
                </h2>
                <ul className="list-unstyled mt-3 text-dark fs-5">
                  {[
                    "Berorientasi pada pelayanan yang prima.",
                    "Menjunjung tinggi nilai-nilai integritas, profesionalisme, dan tanggung jawab.",
                    "Meningkatkan kualitas sumber daya manusia secara berkelanjutan.",
                    "Memberikan nilai tambah kepada pelanggan, pemegang saham, dan masyarakat.",
                  ].map((item, idx) => (
                    <li key={idx} className="mb-3 d-flex align-items-start">
                      <span
                        className="me-3 fs-4"
                        style={{ color: primaryBlue }}
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className={"modal-overlay"}
          onClick={closeZoomModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1070,
            backdropFilter: "blur(8px)",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <div
            className={"modal-content"}
            style={{
              position: "relative",
              maxWidth: "95vw",
              maxHeight: "95vh",
              overflow: "hidden",
              cursor: zoom > 1 ? "grab" : "zoom-in",
            }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
          >
            <img
              ref={imageRef}
              src="/image/visi-&-misi.jpg"
              alt="Visi & Misi PT Graha Sarana Gresik"
              style={{
                maxWidth: "100%",
                maxHeight: "90vh",
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: "center center",
                cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
            />

            <button
              onClick={closeZoomModal}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "rgba(0, 0, 0, 0.6)",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "1.5rem",
                cursor: "pointer",
                zIndex: 1071,
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
              aria-label="Tutup gambar"
            >
              &times;
            </button>

            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                right: "1rem",
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                backdropFilter: "blur(4px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                zIndex: 2,
              }}
            >
              Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            background-color: rgba(0, 0, 0, 0.8);
          }
          to {
            background-color: rgba(0, 0, 0, 0.95);
          }
        }
      `}</style>
    </>
  );
}