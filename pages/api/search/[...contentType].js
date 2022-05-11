import fetch from 'node-fetch';
import qs from 'qs';
import { object, string, array } from 'yup';

export default async function handler(req, res) {
  const search = { type: req.query.contentType, query: req.query.query };

  const Schema = object({
    type: array()
      .ensure()
      .of(string().oneOf(['items', 'resources', 'articles']))
      .required('Content type required'),
    query: string().required('Search query required'),
  });

  const validation = await Schema.isValid(search);
  if (validation) {
    const promises = search.type.map((type) => {
      const populateFields = [];
      const filters = {};
      switch (type) {
        case 'items':
          populateFields.push('images', 'itemCategory');
          filters['$or'] = [
            {
              title: { $containsi: search.query },
            },
            {
              alternateSearchTerms: { $containsi: search.query },
            },
          ];
          break;

        case 'resources':
          populateFields.push('images', 'resourceTags');
          filters['$or'] = [
            {
              title: { $containsi: search.query },
            },
            {
              description: { $containsi: search.query },
            },
          ];
          break;

        case 'articles':
          populateFields.push('coverImage', 'category');
          filters['$or'] = [
            {
              title: { $containsi: search.query },
            },
            {
              content: { $containsi: search.query },
            },
          ];
          break;
      }

      const queryString = `${process.env.API_URL}/${type}?${qs.stringify({
        populate: populateFields,
        pagination: { pageSize: 1000 },
        filters,
      })}`;

      return fetch(queryString, {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }).then((resp) => resp.json());
    });

    Promise.all(promises).then((results) => {
      const data = {};
      results.map((result, key) => {
        data[search.type[key]] = result.data;
      });
      res.status(200).json({ success: true, data });
    });
  } else {
    res.status(403).json({ error: true });
  }
}
