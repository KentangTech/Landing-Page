export default async function handler(req, res) {
  try {
    const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'https://adminweb.grahasaranagresik.com';
    const response = await fetch(`${LARAVEL_API_URL}/api/news`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) throw new Error(response.statusText);

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Gagal fetch data' });
  }
}