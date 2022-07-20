import Cookies from 'cookies';

export async function logVisit() {
  if (window) {
    console.log(`logging ${window.location.pathname}`);
    const response = await fetch(`/api/log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });
  }
}

export function getOrSetVisitorToken(req, res) {
  const cookies = new Cookies(req, res);
  const date = new Date();
  let visitorId = cookies.get('v_id');
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

  return visitorId;
}
