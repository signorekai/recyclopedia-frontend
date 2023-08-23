import qs from 'qs';

export default function handler(req, res) {
  async function load() {
    const ip = process.env.API_URL;
    const query = {
      populate: [
        'images',
        'resourceTags',
        'relatedItems',
        'relatedItems.images',
        'externalLinks',
      ],
      sort: ['visits:desc', 'title'],
      publicationState: 'live',
      pagination: {
        page: parseInt(req.query.page) + 1,
        pageSize: req.query.pageSize,
      },
    };

    if (!!req.query.tag) {
      query.filters = {
        resourceTags: {
          title: {
            $in: req.query.tag.split(','),
          },
        },
      };
    }

    const result = await fetch(`${ip}/resources?${qs.stringify(query)}`, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    const items = await result.json();
    return items;
  }
  load().then((items) => {
    res.status(200).json(items);
  });
}
