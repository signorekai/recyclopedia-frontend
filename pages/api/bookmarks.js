import { getToken } from 'next-auth/jwt';
import qs from 'qs';
import { checkHTTPMethod } from '../../lib/functions';
import { staticFetcher } from '../../lib/hooks';

export default async function handler(req, res) {
  checkHTTPMethod(res, req.method);
  const token = await getToken({ req });

  if (token) {
    const bookmarkResponse = await fetch(
      `${process.env.API_URL}/bookmarks?${qs.stringify({
        populate: {
          item: { populate: ['images', 'itemCategory'] },
          resource: { populate: ['images'] },
          article: { populate: ['coverImage'] },
        },
        pagination: {
          page: 1,
          pageSize: 10000,
        },
        sort: ['updatedAt:desc'],
        filters: {
          user: {
            id: {
              $eq: token.id,
            },
          },
        },
      })}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      },
    );

    const { data: bookmarks } = await bookmarkResponse.json();
    const result = {};
    bookmarks.forEach((bookmark) => {
      ['article', 'item', 'resource'].forEach((type) => {
        if (bookmark.hasOwnProperty(type)) {
          if (type === 'resource') {
            if (typeof result[bookmark.subCategory] === 'undefined') {
              result[bookmark.subCategory] = [];
            }
            result[bookmark.subCategory].push(bookmark[type]);
          } else {
            if (typeof result[type] === 'undefined') {
              result[type] = [];
            }
            result[type].push(bookmark[type]);
          }
        }
      });
    });
    console.log(result);
    res.status(200).json(result);
  } else {
    res.status(401).json({
      success: false,
    });
  }
  res.end();
}
