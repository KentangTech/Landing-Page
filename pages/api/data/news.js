export default async function handler(req, res) {
  try {
    const response = await fetch('https://adminweb.grahasaranagresik.com//api/news');
    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal fetch data dari Laravel' });
  }
}