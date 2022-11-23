import { object, string } from 'yup';
import { staticFetcher } from '../../lib/hooks';

export const RegisterSchema = object({
  email: string().email('Email is invalid').required('Email required'),
  password: string()
    .required('Password required')
    .min(8, 'Password needs to be at least 8 characters long')
    .matches(/\d/, 'Requires at least 1 digit'),
  name: string().required('Name required'),
});

export default async function handler(req, res) {
  const { body } = req;

  const validation = await RegisterSchema.isValid(body);
  if (validation) {
    // @todo register user!
    const data = await staticFetcher(
      `${process.env.API_URL}/users`,
      process.env.API_KEY,
      {
        filters: {
          email: {
            $eq: body.email,
          },
        },
      },
    );

    if (data.length > 0) {
      res.status(400).json({
        success: false,
        data: {
          error: 'Email is already used.',
        },
      });
    } else {
      const response = await fetch(
        `${process.env.API_URL}/auth/local/register`,
        {
          method: 'POST',
          body: JSON.stringify({
            username: body.email,
            email: body.email,
            password: body.password,
            name: body.name,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const results = await response.json();

      if (results.hasOwnProperty('error') === false) {
        res.status(200).json({ success: true, data: results.data });
      } else {
        res.status(400).json({
          success: false,
          data: {
            error: results.error.message,
          },
        });
      }
    }
  } else {
    // @todo test invalid
    res.status(400).json({
      success: false,
      data: {
        error: validation,
      },
    });
  }
}
