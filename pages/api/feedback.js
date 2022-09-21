import fetch from 'node-fetch';
import { FeedbackFormSchema } from '../../components/Report';

export default async function handler(req, res) {
  const { body } = req;
  const { formData } = JSON.parse(body);

  const validation = await FeedbackFormSchema.isValid(formData);

  if (validation) {
    let response = await fetch(`${process.env.API_URL}/feedbacks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          ...formData,
        },
      }),
    });
    // let response = await fetch(`${process.env.API_URL}/ezforms/submit`, {
    //   method: 'POST',
    //   body,
    //   headers: { 'Content-Type': 'application/json' },
    // });

    let results = await response.json();
    res.status(response.status).json(results);
  } else {
    res.status(403).json({
      error: true,
    });
  }
}
