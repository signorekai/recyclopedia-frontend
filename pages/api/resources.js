import qs from 'qs';

export default function handler(req, res) {
  async function load() {
    const ip = process.env.API_URL;
    const query = qs.stringify({
      populate: ['images'],
      pagination: {
        page: parseInt(req.query.page) + 1,
        pageSize: req.query.pageSize,
      },
    });

    if (!!req.query.tag) {
      query.filters.title.$eq = re.query.tag;
    }

    const result = await fetch(`${ip}/api/resources?${query}`, {
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
