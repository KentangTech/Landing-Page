import { syncDataIfNeeded } from '../../../lib/sync-data';
import { NextApiRequest, NextApiResponse } from 'next';

const SECRET_TOKEN = process.env.WEBHOOK_SECRET_TOKEN;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan' });
  }

  const token = req.headers['x-webhook-token'] || req.headers['authorization'];
  if (token !== SECRET_TOKEN) {
    return res.status(401).json({ error: 'Akses ditolak' });
  }

  const { key } = req.body;

  const validKeys = ['news', 'direksi', 'social-media', 'bisnis'] as const;
  if (!key || !validKeys.includes(key as any)) {
    return res.status(400).json({ error: 'Key tidak valid' });
  }

  try {
    await syncDataIfNeeded(key);
    return res.status(200).json({ success: true, message: `Data ${key} berhasil diupdate` });
  } catch (error) {
    console.error(`Gagal sync ${key}:`, error);
    return res.status(500).json({ error: 'Gagal sync data' });
  }
}