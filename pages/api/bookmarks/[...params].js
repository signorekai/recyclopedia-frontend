import { getToken } from 'next-auth/jwt';
import { object, string, number } from 'yup';
import qs from 'qs';

import { checkHTTPMethod } from '../../../lib/functions';
import { staticFetcher } from '../../../lib/hooks';

export default async function handler(req, res) {
  const params = req.query.params || [];
  checkHTTPMethod(res, req.method, ['GET', 'POST', 'DELETE']);
  const token = await getToken({ req });

  if (token === null) res.status(401).end();

  if (params.length !== 2) {
    res.status(400);
  }

  const [contentType, slug] = params;

  const Schema = object({
    contentType: string()
      .oneOf(['items', 'resources', 'articles'])
      .required('Content type required'),
    slug: string().required('Slug required'),
  });

  const valid = await Schema.isValid({ contentType, slug });
  if (valid) {
    let filters = {};
    switch (contentType) {
      case 'items':
        filters.item = {
          slug: {
            $eq: slug,
          },
        };
        break;

      case 'resources':
        filters.resource = {
          slug: {
            $eq: slug,
          },
        };
        break;

      case 'articles':
        filters.article = {
          slug: {
            $eq: slug,
          },
        };
        break;
    }

    let bookmarkResult = await staticFetcher(
      `${process.env.API_URL}/bookmarks?${qs.stringify({
        populate: {
          item: { populate: ['images'] },
          resource: { populate: ['coverImage'] },
          article: { populate: ['coverImage'] },
        },
        sort: ['updatedAt:desc'],
        filters: {
          user: {
            id: {
              $eq: token.id,
            },
          },
          ...filters,
        },
      })}`,
      process.env.API_KEY,
    );

    switch (req.method) {
      case 'GET':
        res.status(200).json({
          data: bookmarkResult.data,
        });
        break;

      case 'POST':
        const { contentId, subCategory } = JSON.parse(req.body);

        const BodySchema = object({
          contentId: number().required('Invalid ID').positive('Invalid ID'),
          subCategory: string()
            .required('Invalid subcategory')
            .oneOf(['donate', 'resources', 'shops'], 'Invalid subcategory'),
        });

        const bodyValid = await BodySchema.isValid({ contentId, subCategory });

        if (bodyValid !== true) {
          res.status(400).end();
        } else if (bookmarkResult.data.length > 0) {
          res.status(400).end(`Already Bookmarked`);
        } else {
          const content = { user: token.id };

          switch (contentType) {
            case 'items':
              content.item = contentId;
              break;

            case 'resources':
              content.resource = contentId;
              content.subCategory = subCategory;
              break;

            case 'articles':
              content.article = contentId;
              break;
          }

          const postResponse = await fetch(`${process.env.API_URL}/bookmarks`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
            method: 'POST',
            body: JSON.stringify({
              data: content,
            }),
          });
          const postResult = await postResponse.json();

          res.status(201).json(postResult);
        }
        break;

      case 'DELETE':
        if (bookmarkResult.data.length === 0) {
          res.status(404).end(`Already Bookmarked`);
        } else {
          const deleteResponse = await fetch(
            `${process.env.API_URL}/bookmarks/${bookmarkResult.data[0].id}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.API_KEY}`,
              },
              method: 'DELETE',
            },
          );
          const postResult = await deleteResponse.json();

          res.status(200).json(postResult);
        }
        break;
    }
  } else {
    res.status(400);
  }
  res.end();
}
