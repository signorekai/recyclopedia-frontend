import qs from 'qs';

export default function handler(req, res) {
  console.log(4);
  async function load() {
    const ip = process.env.API_URL;
    const query = {
      populate: ['coverImage', 'items', 'category'],
      sort: ['updatedAt:desc'],
      pagination: {
        page: parseInt(req.query.page) + 1,
        pageSize: req.query.pageSize,
      },
    };

    if (!!req.query.category) {
      query.filters = {
        category: {
          title: {
            $in: req.query.category.split(','),
          },
        },
      };
    }

    const result = await fetch(`${ip}/api/articles?${qs.stringify(query)}`, {
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
