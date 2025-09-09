"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaInstagram, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";
import style from "../css/medsos.module.css";

interface Platform {
  name: string;
  url: string;
}

interface RawSocialMediaItem {
  id: number;
  name?: string;
  username?: string;
  image?: string;
  platforms?: Array<{
    name: string;
    url: string;
  }>;
}

interface SocialMediaItem {
  id: number;
  name: string;
  username: string;
  image: string;
  platforms: Platform[];
}

export default function SocialMediaCard() {
  const [socialMediaData, setSocialMediaData] = useState<SocialMediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSocialMedia = async () => {
      try {
        const res = await fetch("/data-json/social-media.json");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const rawData = await res.json();

        const dataArray: RawSocialMediaItem[] = Array.isArray(rawData.data)
          ? rawData.data
          : Array.isArray(rawData)
          ? rawData
          : [];

        if (!Array.isArray(dataArray)) {
          throw new Error("Format data media sosial tidak valid");
        }

        const baseUrl = process.env.NEXT_PUBLIC_LARAVEL_API || "https://adminweb.grahasaranagresik.com";

        const formatted: SocialMediaItem[] = dataArray.map((item: RawSocialMediaItem) => {
          const platforms: Platform[] = Array.isArray(item.platforms)
            ? item.platforms.map((p) => ({
                name: p.name || "Unknown",
                url: p.url || "#",
              }))
            : [];

          return {
            id: item.id || Math.random(),
            name: item.name || "Nama Tidak Diketahui",
            username: item.username || "",
            image: item.image
              ? item.image.startsWith("http")
                ? item.image
                : `${baseUrl}/${item.image}`.replace("//", "/")
              : "/images/placeholder.jpg",
            platforms,
          };
        });

        setSocialMediaData(formatted);
      } catch (error) {
        console.error("Gagal ambil data media sosial dari /data-json/social-media.json:", error);
        setSocialMediaData([]);
      } finally {
        setLoading(false);
      }
    };

    loadSocialMedia();
  }, []);

  const getPlatformIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("instagram") || n === "ig") return <FaInstagram />;
    if (n.includes("twitter") || n.includes("x") || n === "x") return <FaTwitter />;
    if (n.includes("facebook") || n === "fb") return <FaFacebook />;
    if (n.includes("linkedin") || n === "in") return <FaLinkedin />;
    return <FaInstagram />;
  };

  if (loading) {
    return (
      <div className={style.container}>
        <p>Loading media sosial...</p>
      </div>
    );
  }

  return (
    <div className={style.container} id="social-media-section">
      <div className={style.content}>
        <h1 className={style.title}>Our Social Media</h1>
        <div className={style.cardGrid}>
          {socialMediaData.length > 0 ? (
            socialMediaData.map((user) => (
              <a
                key={user.id}
                href={user.platforms[0]?.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={style.cardLink}
              >
                <div className={style.card}>
                  <div className={style.imageContainer}>
                    <div className={style.imageWrapper}>
                      <div className={style.imageBingkai}>
                        <Image
                          src={user.image}
                          alt={user.name}
                          fill
                          sizes="(max-width: 300px) 100vw"
                          style={{ objectFit: "contain" }}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={style.cardContent}>
                    <h2 className={style.name}>{user.name}</h2>
                    <p className={style.username}>{user.username}</p>
                    <div className={style.iconContainer}>
                      {user.platforms.map((platform, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(platform.url, "_blank", "noopener,noreferrer");
                          }}
                          className={style.iconButton}
                          aria-label={`Buka ${platform.name}`}
                        >
                          {getPlatformIcon(platform.name)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p>Tidak ada data media sosial.</p>
          )}
        </div>
      </div>
    </div>
  );
}