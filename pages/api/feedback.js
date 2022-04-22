import fetch from 'node-fetch';
import { FeedbackFormSchema } from '../../components/Report';

export default async function handler(req, res) {
  const { body } = req;
  const { formData } = JSON.parse(body);

  const validation = await FeedbackFormSchema.isValid(formData);

  if (validation) {
    let response = await fetch(`${process.env.API_URL}/api/ezforms/submit`, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    });

    let results = await response.json();
    res.status(response.status).json(results);
  } else {
    res.status(403).json({
      error: true,
    });
  }
}
