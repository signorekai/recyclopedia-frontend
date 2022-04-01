import qs from 'qs';

// todo
export default function handler(req, res) {
  async function load() {
    const ip = process.env.API_URL;
    const query = qs.stringify({
      sort: 'title',
      pagination: {
        page: 1,
        pageSize: 100000,
      },
    });

    const result = await fetch(`${ip}/api/resources-tags?${query}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    const items = await result.json();
    return items.data;
  }
  load().then((items) => {
    res.setHeader('Cache-Control', 's-maxage=86400');
    res.status(200).json(items);
  });
}
