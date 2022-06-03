import { getToken } from 'next-auth/jwt';
import qs from 'qs';
import { checkHTTPMethod } from '../../lib/functions';

export default async function handler(req, res) {
  checkHTTPMethod(res, req.method);
  const token = await getToken({ req });

  if (token) {
    const bookmarks = await fetch(
      `${process.env.API_URL}/bookmarks?${qs.stringify({
        populate: {
          item: { populate: ['images'] },
          resource: { populate: ['coverImage'] },
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
    const result = await bookmarks.json();
    console.log(result);
    res.status(200).json(result.data);
  } else {
    res.status(401);
  }
  res.end();
}
