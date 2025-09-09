export async function getJsonData(filename: string): Promise<any> {
  try {
    const res = await fetch(`/data-json/${filename}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${filename}.json:`, error);
    return null;
  }
}