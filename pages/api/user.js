import { getToken } from 'next-auth/jwt';
import { string, object, ref } from 'yup';
import { checkHTTPMethod } from '../../lib/functions';
import qs from 'qs';

export default async function handler(req, res) {
  checkHTTPMethod(res, req.method, ['POST', 'DELETE']);
  const token = await getToken({ req });

  if (!token) {
    res.status(401).json({
      success: false,
    });
    return false;
  }

  switch (req.method) {
    case 'POST': {
      const Schema = object({
        field: string().required().oneOf(['password', 'name', 'email']),
        name: string().when('field', {
          is: 'name',
          then: (schema) => schema.required(),
        }),
        email: string()
          .email()
          .when('field', {
            is: 'email',
            then: (schema) => schema.required(),
          }),
        oldPassword: string().when('field', {
          is: 'password',
          then: (schema) =>
            schema
              .required('Password required')
              .min(8, 'Password needs to be at least 8 characters long')
              .matches(/\d/, 'Requires at least 1 digit'),
        }),
        newPassword1: string().when('field', {
          is: 'password',
          then: (schema) =>
            schema
              .required('Password required')
              .min(8, 'Password needs to be at least 8 characters long')
              .matches(/\d/, 'Requires at least 1 digit'),
        }),
        newPassword2: string().when('field', {
          is: 'password',
          then: (schema) =>
            schema
              .required('Password required')
              .oneOf([ref('newPassword1')], `Your passwords don't match`),
        }),
      });

      if (token) {
        const validation = await Schema.isValid(req.body);

        if (validation) {
          if (req.body.field === 'name') {
            const response = await fetch(
              `${process.env.API_URL}/users/${token.id}`,
              {
                body: JSON.stringify({
                  name: req.body.name,
                }),
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${process.env.API_KEY}`,
                },
              },
            );
            if (response.ok) {
              res.status(200).json({
                success: true,
              });
            } else {
              res.status(400).json({
                success: false,
                data: {
                  error: response,
                },
              });
            }
          } else if (req.body.field === 'email') {
            fetch(`${process.env.API_URL}/users/${token.id}`, {
              body: JSON.stringify({
                email: req.body.email,
                username: req.body.email,
                confirmed: false,
              }),
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.API_KEY}`,
              },
            })
              .then(() =>
                fetch(`${process.env.API_URL}/auth/send-email-confirmation`, {
                  body: JSON.stringify({
                    email: req.body.email,
                  }),
                  method: 'post',
                  headers: { 'Content-Type': 'application/json' },
                }),
              )
              .then(() => {
                res.status(200).json({
                  success: true,
                });
              })
              .catch((err) => {
                console.error(err);
                res.status(400).json({
                  success: false,
                  data: {
                    error: err,
                  },
                });
              });
          } else if (req.body.field === 'password') {
            console.log(115);
            const { oldPassword, newPassword1, newPassword2 } = req.body;
            const loginResponse = await fetch(
              `${process.env.API_URL}/auth/local`,
              {
                method: 'POST',
                body: JSON.stringify({
                  identifier: token.email,
                  password: oldPassword,
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );
            const loginResult = await loginResponse.json();
            if (loginResult.jwt) {
              const response = await fetch(
                `${process.env.API_URL}/users/${token.id}`,
                {
                  body: JSON.stringify({
                    password: newPassword1,
                  }),
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.API_KEY}`,
                  },
                },
              );
              if (response.ok) {
                res.status(200).json({
                  success: true,
                });
              } else {
                res.status(400).json({
                  success: false,
                  data: {
                    error: response,
                  },
                });
              }
            } else {
              res.status(400).json({
                success: false,
                data: {
                  error: 'You did not enter your current password correctly',
                },
              });
            }
            res.status(200).end();
          } else {
            res.status(400).json({
              success: false,
              data: {
                error: validation,
              },
            });
          }
        } else {
          res.status(400).json({
            success: false,
            data: {
              error: validation,
            },
          });
        }
      } else {
        res.status(401).json({
          success: false,
        });
      }
      break;
    }

    case 'DELETE': {
      const { API_URL, API_KEY } = process.env;
      const Schema = object({
        name: string().equals([token.name]),
      });

      const validation = await Schema.isValid(req.body);

      if (validation) {
        // @todo remove all bookmarks

        const userResponse = await fetch(
          `${API_URL}/users/${token.id}?${qs.stringify({
            populate: ['bookmarks'],
          })}`,
          {
            headers: {
              Authorization: `Bearer ${API_KEY}`,
            },
          },
        );

        const { bookmarks } = await userResponse.json();

        await Promise.all(
          bookmarks.map(async ({ id }) => {
            return new Promise(async (resolve, reject) => {
              const response = await fetch(`${API_URL}/bookmarks/${id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${API_KEY}`,
                },
              });

              if (response.ok) {
                resolve();
              } else {
                reject();
              }
            });
          }),
        )
          .then(async () => {
            const response = await fetch(
              `${process.env.API_URL}/users/${token.id}`,
              {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${process.env.API_KEY}`,
                },
              },
            );
            if (response.ok) {
              res.status(200).json({
                success: true,
              });
            } else {
              res.status(400).json({
                success: false,
                data: {
                  error: response,
                },
              });
            }
          })
          .catch(() => {
            res.status(400).json({
              success: false,
            });
          });
      }

      // res.status(400).json({ success: true, data: { validation } });
      break;
    }
  }
}
