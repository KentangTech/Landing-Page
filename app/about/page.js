"use client";
import { useEffect, useState } from "react";
import Navigation from "./NavigationAbout";
import Footer from "../components/footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import BusinessSection from "./BusinessSection";
import VisionMisionSection from "./VisionMisionSection";
import ValuesSection from "./ValuesSection";
import "../globals.css";

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);
  R = Math.min(255, Math.max(0, R + (R * percent) / 100));
  G = Math.min(255, Math.max(0, G + (G * percent) / 100));
  B = Math.min(255, Math.max(0, B + (B * percent) / 100));
  const RR = Math.round(R).toString(16).padStart(2, "0");
  const GG = Math.round(G).toString(16).padStart(2, "0");
  const BB = Math.round(B).toString(16).padStart(2, "0");
  return `#${RR}${GG}${BB}`;
}

function TypingText({ prefix, animatedText, index, isVisible, primaryBlue }) {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [isStarting, setIsStarting] = useState(true);

  useEffect(() => {
    if (!isVisible || !animatedText) {
      if (animatedText) setDisplayText(animatedText);
      return;
    }
    const typeSpeed = isDeleting ? 70 : 150;
    const pauseTime = 2000;
    const startDelay = 300;
    let isCancelled = false;

    const handleTyping = () => {
      if (isCancelled) return;
      setDisplayText((prevText) => {
        if (isCancelled) return prevText;
        if (isDeleting) {
          return animatedText.substring(0, prevText.length - 1);
        } else {
          return animatedText.substring(0, prevText.length + 1);
        }
      });

      if (!isDeleting && displayText === animatedText) {
        setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setLoopNum((prev) => prev + 1);
        return;
      }
    };

    let timerId;
    if (isStarting) {
      timerId = setTimeout(() => {
        setIsStarting(false);
        const typeRecursive = () => {
          if (isCancelled || !isVisible) return;
          setTimeout(() => {
            handleTyping();
            typeRecursive();
          }, typeSpeed);
        };
        typeRecursive();
      }, startDelay);
    } else {
      const typeRecursive = () => {
        if (isCancelled || !isVisible) return;
        setTimeout(() => {
          handleTyping();
          typeRecursive();
        }, typeSpeed);
      };
      typeRecursive();
    }

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
    };
  }, [displayText, isDeleting, loopNum, isStarting, isVisible, animatedText]);

  return (
    <h5
      className="fw-bold"
      style={{
        color: primaryBlue,
        minHeight: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {prefix}
      {displayText}
      <span
        style={{
          display: isStarting ? "none" : "inline-block",
          width: "3px",
          height: "1.2em",
          backgroundColor: primaryBlue,
          marginLeft: "2px",
          animation: "smoothBlink 1.5s infinite",
          opacity: 1,
        }}
      />
    </h5>
  );
}

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState({});
  const [modalImage, setModalImage] = useState(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const primaryBlue = "#1976d2";
  const primaryBlueDark = shadeColor(primaryBlue, -15);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = entry.target.dataset.idx;
            setIsVisible((prev) => ({ ...prev, [idx]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll("[data-idx]");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setIsVisible((prev) => ({ ...prev, backBtn: true }));
  }, []);

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
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

  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      const { clientX, clientY } = e;
      setPosition((pos) => ({
        x: clientX - pos.x,
        y: clientY - pos.y,
      }));
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-white" style={{ paddingTop: "80px" }}>
        {/* Hero Section */}
        <div
          className="w-100 position-relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #010a15, #041326, #0a1e3a, #102a4e, #010a15)",
            backgroundSize: "300% 300%",
            animation: "gradientShift 8s ease-in-out infinite",
            marginTop: "-1rem",
          }}
        >
          <style jsx>{`
            @keyframes gradientShift {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
          `}</style>
          <div className="container px-4 py-5 text-center">
            <h1
              className="display-4 fw-bold text-white mb-4"
              data-idx="0"
              style={{
                textShadow:
                  "0 0 15px rgba(255,255,255,0.4), 0 0 30px rgba(255,255,255,0.2)",
                opacity: isVisible["0"] ? 1 : 0,
                transform: isVisible["0"]
                  ? "translateY(0)"
                  : "translateY(-20px)",
                transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Tentang Kami
            </h1>
            <p
              className="lead text-white-50 fs-4"
              data-idx="1"
              style={{
                maxWidth: "800px",
                margin: "0 auto",
                opacity: isVisible["1"] ? 1 : 0,
                transform: isVisible["1"]
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
              }}
            >
              PT Graha Sarana Gresik – Komitmen kami terhadap mutu, lingkungan,
              dan keamanan pangan dalam setiap layanan.
            </p>
          </div>
        </div>

        {/* Sections */}
        <section id="visi">
          {" "}
          <VisionMisionSection
            isVisible={isVisible}
            primaryBlue={primaryBlue}
            openModal={openModal}
          />
        </section>
        <section id="nilai">
          {" "}
          <ValuesSection
            isVisible={isVisible}
            primaryBlue={primaryBlue}
            TypingText={TypingText}
          />
        </section>
        <section id="bisnis">
          <BusinessSection
            isVisible={isVisible}
            primaryBlue={primaryBlue}
            openModal={openModal}
            closeModal={closeModal}
            modalImage={modalImage}
            scale={scale}
            position={position}
            isDragging={isDragging}
            handleWheel={handleWheel}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
          />
        </section>
        <Footer />
        <ScrollToTopButton />
      </div>
    </>
  );
}
