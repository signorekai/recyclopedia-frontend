import { checkHTTPMethod } from '../../lib/functions';
import { userAgentFromString } from 'next/server';
import Cookies from 'cookies';

export default async function handler(req, res) {
  checkHTTPMethod(res, req.method, ['POST']);
  const cookies = new Cookies(req, res);
  const { device, browser, os } = userAgentFromString(
    req.headers['user-agent'],
  );
  const location = new URL(req.headers['referer']);
  const path = location.pathname;

  let visitorId = cookies.get('v_id');
  let date = new Date();
  if (visitorId === undefined) {
    visitorId =
      date.getTime().toString(16) +
      Math.floor(Math.random() * (999999 - 100000) + 100000).toString(16);
  }

  date.setTime(date.getTime() + 2 * 365 * 24 * 60 * 60 * 1000);
  cookies.set('v_id', visitorId, {
    expires: date,
    sameSite: 'strict',
  });

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
}
