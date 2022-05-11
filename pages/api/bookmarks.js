import { getToken } from 'next-auth/jwt';
import qs from 'qs';

export default async function handler(req, res) {
  const token = await getToken({ req });
  if (token) {
    const bookmarks = await fetch(
      `${process.env.API_URL}/bookmarks?${qs.stringify({
        populate: '*',
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
    res.status(200).json(result.data);
  } else {
    res.status(400);
  }
}
