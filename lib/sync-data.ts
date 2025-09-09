import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'public', 'data-json');

const API_BASE_URL = 'https://adminweb.grahasaranagresik.com/api';

const ENDPOINTS = {
  news: '/news',
  direksi: '/direksi',
  'social-media': '/social-media',
  bisnis: '/bisnis',
} as const;

type EndpointKey = keyof typeof ENDPOINTS;

const hashData = (data: any): string => {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
};

const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await axios.get(url, { timeout: 10000 });
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1500 * (i + 1)));
    }
  }
};

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const mapNewsItem = (item: any) => ({
  id: item.id,
  title: item.judul || 'Tanpa Judul',
  desc: item.deskripsi || item.konten || '',
  content: item.deskripsi || item.konten || '',
  image: item.gambar_url?.trim() || item.gambar ? `/storage/${item.gambar}` : '/images/placeholder.jpg',
  category: item.category || 'Berita',
  created_at: item.created_at,
  date: item.created_at,
  readTime: '5 min read',
});

export const syncDataIfNeeded = async (key: EndpointKey) => {
  const url = `${API_BASE_URL}${ENDPOINTS[key]}`;
  const filePath = path.join(DATA_DIR, `${key}.json`);
  const metaPath = path.join(DATA_DIR, 'cache-meta.json');

  let meta: Record<string, { hash: string; updatedAt: number }> = {};
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    } catch (e) {
      console.warn('Cache meta rusak, reset.');
      meta = {};
    }
  }

  try {
    const response = await fetchWithRetry(url);
    if (response.status !== 200) return;

    let newData = response.data;

    if (key === 'news' && Array.isArray(newData)) {
      newData = newData.map(mapNewsItem);
    }

    const newHash = hashData(newData);
    const currentHash = meta[key]?.hash;

    if (newHash !== currentHash) {
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
      meta[key] = { hash: newHash, updatedAt: Date.now() };
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
      console.log(`✅ Data '${key}' diperbarui`);
    }
  } catch (err) {
    console.error(`❌ Gagal sinkron '${key}':`, (err as any).message);
  }
};

export const syncAllData = async () => {
  console.log('Syncing data...');
  const keys = Object.keys(ENDPOINTS) as EndpointKey[];
  for (const key of keys) {
    await syncDataIfNeeded(key);
  }
};