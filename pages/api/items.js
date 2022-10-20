import qs from 'qs';

export default function handler(req, res) {
  async function load() {
    const ip = process.env.API_URL;
    const query = {
      populate: ['images'],
      fields: ['title', 'slug'],
      publicationState: 'live',
      sort: ['visits:desc', 'title'],
      pagination: {
        page: parseInt(req.query.page) + 1,
        pageSize: req.query.pageSize,
      },
    };

    if (!!req.query.category) {
      query.filters = {
        itemCategory: {
          title: {
            $in: req.query.category.split('||'),
          },
        },
      };
    }

    const result = await fetch(`${ip}/items?${qs.stringify(query)}`, {
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
