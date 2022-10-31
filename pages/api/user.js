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
        field: string().required().oneOf(['name', 'email']),
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
