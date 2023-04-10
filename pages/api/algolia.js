import qs from 'qs';
import { staticFetcher } from '../../lib/hooks';

export default function handler(req, res) {
  async function load() {
    // const ip = process.env.API_URL;
    // const query = {
    //   publicationState: 'preview',
    //   fields: ['title', 'description', 'slug', 'locations', 'items'],
    //   // fields: ['title', 'alternateSearchTerms', 'slug', 'publishedAt'],  // items
    //   // fields: ['title', 'content', 'slug', 'publishedAt'], // articles
    //   populate: ['images', 'resourceTags'],
    //   pagination: {
    //     limit: 1000,
    //   },
    // };

    // const items = await staticFetcher(
    //   `${ip}/resources`,
    //   process.env.API_KEY,
    //   query,
    // );

    // items.data.forEach((entry, index) => {
    //   items.data[index]['objectID'] = entry.id;
    // });

    // return items;
    return {};
  }
  load()
    .then((items) => {
      // res.setHeader('Cache-Control', 's-maxage=86400');
      res.status(200).json(items.data);
    })
    .catch((err) => {
      console.log(35, err);
      res.status(500).json({ error: err });
    });
}
