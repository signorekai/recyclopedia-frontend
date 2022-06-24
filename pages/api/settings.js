import qs from 'qs';
import { staticFetcher } from '../../lib/hooks';

export default async function handler(req, res) {
  const { data: settings } = await staticFetcher(
    `${process.env.API_URL}/general-setting?${qs.stringify({
      populate: ['footerSocialIcons'],
    })}`,
    process.env.API_KEY,
  );

  res.json({ data: settings });
}
