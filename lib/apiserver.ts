import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

export async function readJsonFile(filename: string): Promise<any> {
  const filePath = path.join(publicDir, 'data-json', `${filename}.json`);
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function syncAllData() {
  const API_BASE_URL = 'https://adminweb.grahasaranagresik.com/api';
  const ENDPOINTS = {
    news: '/news',
    direksi: '/direksi',
    'social-media': '/social-media',
    bisnis: '/bisnis',
  } as const;

  const DATA_DIR = path.join(publicDir, 'data-json');

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const hashData = (data: any): string => {
    return require('crypto')
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
  };

  for (const [key, endpoint] of Object.entries(ENDPOINTS)) {
    const url = `${API_BASE_URL}${endpoint}`;
    const filePath = path.join(DATA_DIR, `${key}.json`);
    const metaPath = path.join(DATA_DIR, 'cache-meta.json');

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const newData = await res.json();
      const newHash = hashData(newData);

      let meta: Record<string, { hash: string; updatedAt: number }> = {};
      if (fs.existsSync(metaPath)) {
        meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      }

      if (meta[key]?.hash !== newHash) {
        fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf-8');
        meta[key] = { hash: newHash, updatedAt: Date.now() };
        fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
        console.log(`✅ Data '${key}' diperbarui`);
      }
    } catch (err) {
      console.error(`❌ Gagal sinkron '${key}':`, (err as any).message);
    }
  }
}