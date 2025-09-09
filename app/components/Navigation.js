"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const threshold = window.innerHeight * 0.8;

      const shouldShow = scrollTop > threshold;
      setShowNavbar(shouldShow);
      setScrolled(shouldShow);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => {
    closeMenu();
  };

  const menuItems = [
    { label: "Home", href: "/", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
    { label: "About Us", href: "#about" },
    { label: "Kebijakan", href: "#kebijakan" },
    { label: "News", href: "#news" },
    { label: "Media Sosial", href: "#medsos" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: scrolled ? "rgba(255, 255, 255, 0.98)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.08)" : "none",
        zIndex: 1050,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "72px",
        borderBottom: scrolled ? "1px solid rgba(30, 64, 175, 0.12)" : "none",
        opacity: showNavbar ? 1 : 0,
        visibility: showNavbar ? "visible" : "hidden",
        pointerEvents: showNavbar ? "auto" : "none",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            closeMenu();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#1e40af",
            fontWeight: 700,
            fontSize: "1.3rem",
            textDecoration: "none",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          <img
            src="/image/GSG-kecil.png"
            alt="Logo PT Graha Sarana Gresik"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* Desktop Menu */}
        <ul
          className="desktop-nav"
          style={{
            display: "none",
            listStyle: "none",
            margin: 0,
            padding: 0,
            gap: "24px",
            alignItems: "center",
          }}
        >
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  item.action ? item.action() : window.scrollTo({ top: document.getElementById(item.href.replace("#", ""))?.offsetTop - 80, behavior: "smooth" });
                  closeMenu();
                }}
                style={{
                  display: "block",
                  padding: "0.8rem 1.2rem",
                  color: scrolled ? "#4b5563" : "#f8fafc",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "1.05rem",
                  borderRadius: "10px",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#1e40af";
                  e.target.style.backgroundColor = "rgba(30, 64, 175, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = scrolled ? "#4b5563" : "#f8fafc";
                  e.target.style.backgroundColor = "transparent";
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="mobile-menu-button"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "34px",
            height: "26px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "all 0.3s ease",
            zIndex: 1051,
          }}
        >
          <span
            style={{
              height: "3px",
              backgroundColor: scrolled ? "#1e40af" : "#f8fafc",
              borderRadius: "2px",
              transform: isMenuOpen ? "rotate(45deg) translate(5px, 8px)" : "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
          <span
            style={{
              height: "3px",
              backgroundColor: scrolled ? "#1e40af" : "#f8fafc",
              borderRadius: "2px",
              opacity: isMenuOpen ? 0 : 1,
              transition: "opacity 0.3s ease",
            }}
          />
          <span
            style={{
              height: "3px",
              backgroundColor: scrolled ? "#1e40af" : "#f8fafc",
              borderRadius: "2px",
              transform: isMenuOpen ? "rotate(-45deg) translate(5px, -8px)" : "none",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </button>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <ul
            className="mobile-dropdown-menu"
            style={{
              position: "absolute",
              top: "72px",
              right: "1.5rem",
              backgroundColor: "rgba(255, 255, 255, 0.99)",
              backdropFilter: "blur(14px)",
              borderRadius: "16px",
              padding: "1.2rem 0",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)",
              minWidth: "220px",
              border: "1px solid rgba(30, 64, 175, 0.15)",
              listStyle: "none",
              margin: 0,
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "6px",
              zIndex: 1050,
              animation: "slideDown 0.35s ease forwards",
            }}
          >
            {menuItems.map((item, index) => (
              <li key={index} style={{ width: "100%", padding: "0 1.5rem" }}>
                <Link
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    item.action ? item.action() : window.scrollTo({ top: document.getElementById(item.href.replace("#", ""))?.offsetTop - 80, behavior: "smooth" });
                    closeMenu();
                  }}
                  style={{
                    display: "block",
                    padding: "0.8rem 1.2rem",
                    color: "#4b5563",
                    textDecoration: "none",
                    fontSize: "1.02rem",
                    borderRadius: "10px",
                    transition: "all 0.3s ease",
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CSS Responsif */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-12px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
          .mobile-dropdown-menu {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}