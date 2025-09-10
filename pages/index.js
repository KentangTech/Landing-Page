export async function getStaticProps() {
  const [newsRes, direksiRes, socialRes, bisnisRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/news`),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/direksi`),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/social-media`),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/data/bisnis`),
  ]);

  const news = await newsRes.json();
  const direksi = await direksiRes.json();
  const socialMedia = await socialRes.json();
  const bisnis = await bisnisRes.json();

  return {
    props: {
      news,
      direksi,
      socialMedia,
      bisnis,
    },
    revalidate: 30,
  };
}

export default function Home({ news, direksi, socialMedia, bisnis }) {
  return (
    <div>
      <h1>Berita</h1>
      {news.map(item => <div key={item.id}>{item.title}</div>)}

      <h1>Direksi</h1>
      {direksi.map(item => <div key={item.id}>{item.name}</div>)}

      {/* dst... */}
    </div>
  );
}