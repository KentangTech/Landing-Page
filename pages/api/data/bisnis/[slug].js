export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ error: 'Slug tidak diberikan' });
  }

  try {
    const response = await fetch(`${process.env.LARAVEL_API_URL}/api/bisnis/${slug}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Bisnis tidak ditemukan' });
      }
      throw new Error(`Laravel API responded with status: ${response.status}`);
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching bisnis by slug:', error);
    res.status(500).json({ error: 'Gagal mengambil detail bisnis' });
  }
}