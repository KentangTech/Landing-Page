export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${process.env.LARAVEL_API_URL}/api/bisnis`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Laravel API responded with status: ${response.status}`);
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching bisnis:', error);
    res.status(500).json({ error: 'Gagal mengambil data bisnis' });
  }
}