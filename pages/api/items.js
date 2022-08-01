import qs from 'qs';

export default function handler(req, res) {
  async function load() {
    const ip = process.env.API_URL;
    const query = qs.stringify({
      populate: ['images'],
      sort: ['visits:desc', 'title'],
      publicationState: 'live',
      fields: ['title', 'slug'],
      pagination: {
        page: parseInt(req.query.page) + 1,
        pageSize: req.query.pageSize,
      },
    });

    const result = await fetch(`${ip}/items?${query}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    const items = await result.json();
    return items;
  }
  load().then((items) => {
    res.setHeader('Cache-Control', 's-maxage=86400');
    res.status(200).json(items);
  });
}
