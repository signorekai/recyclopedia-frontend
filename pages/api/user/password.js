import { object, ref, string } from 'yup';

export const PasswordSchema = object({
  currentPassword: string()
    .required('Password required')
    .min(8, 'Password needs to be at least 8 characters long')
    .matches(/\d/, 'Requires at least 1 digit'),
  password: string().when('passwordConfirmation', {
    is: (value) => value && value.length > 0,
    then: (schema) =>
      schema
        .required('Password required')
        .min(8, 'Password needs to be at least 8 characters long')
        .matches(/\d/, 'Requires at least 1 digit'),
  }),
  passwordConfirmation: string()
    .required('Please retype your new password')
    .oneOf([ref('password')], `Your passwords don't match`)
    .notOneOf(
      [ref('currentPassword')],
      `Same password as your current password`,
    ),
});

export default async function handler(req, res) {
  const validation = await PasswordSchema.isValid(req.body);

  if (validation === false) {
    res.status(400).json({
      success: false,
      data: {
        error: validation,
      },
    });
    return false;
  }

  const response = await fetch(`${process.env.API_URL}/auth/change-password`, {
    method: 'post',
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: req.headers.authorization,
    },
  });

  if (response.ok) {
    res.status(200).json({
      success: true,
    });
  } else {
    const result = await response.json();

    res.status(400).json({
      success: false,
      data: {
        error: result.error.message,
      },
    });
  }
}
