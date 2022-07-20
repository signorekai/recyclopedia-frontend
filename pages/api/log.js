import { checkHTTPMethod } from '../../lib/functions';
import { userAgentFromString } from 'next/server';
import { getOrSetVisitorToken } from '../../lib/analytics';

export default async function handler(req, res) {
  checkHTTPMethod(res, req.method, ['POST']);
  const { device, browser, os, isBot } = userAgentFromString(
    req.headers['user-agent'],
  );
  const location = new URL(req.headers['referer']);
  const path = location.pathname;

  const visitorId = getOrSetVisitorToken(req, res);

  if (!isBot) {
    const response = await fetch(`${process.env.API_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          visitorId,
          dateTime: new Date().toISOString(),
          path,
          os,
          device,
          browser,
          userAgent: req.headers['user-agent'],
        },
      }),
    });

    const resp = response.json();
    res.status(response.status).json(resp);
  } else {
    res.status(200).end();
  }
}
