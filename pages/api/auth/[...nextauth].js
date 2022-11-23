import fetch from 'node-fetch';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import { staticFetcher } from '../../../lib/hooks';

const options = {
  pages: {
    signIn: '/login',
    newUser: '/account',
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Email & Password',
      credentials: {
        identifier: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch(`${process.env.API_URL}/auth/local`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.email,
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      profile(profile) {
        return {
          id: profile.email,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      console.log('account provider:', account.provider);

      if (account.provider !== 'credentials' && account.provider !== 'local') {
        const data = await staticFetcher(
          `${process.env.API_URL}/users`,
          process.env.API_KEY,
          {
            filters: {
              email: {
                $eq: user.email,
              },
            },
          },
        );

        if (data.length === 0) {
          return true;
        } else {
          return '/login?error=AlreadyRegisteredViaEmail';
        }
      } else {
        return true;
      }
    },
    session: async ({ session, token }) => {
      session.jwt = token.jwt;
      session.user = token;
      return Promise.resolve(session);
    },
    jwt: async ({ token, user, account, ...others }) => {
      const isSignIn = user ? true : false;
      console.log(86);
      if (isSignIn) {
        if (!!account && !!account.provider) {
          if (
            account.provider !== 'local' &&
            account.provider !== 'credentials'
          ) {
            const response = await fetch(
              `${process.env.API_URL}/auth/${account.provider}/callback?access_token=${account?.access_token}`,
            );
            const data = await response.json();
            token.provider = account.provider;
            token.jwt = data.jwt;
            token.sub = data.user.email;
            token.id = data.user.id;
            token.email = data.user.email;
            token.name = data.user.name || data.user.username;
          } else {
            token.provider = 'local';
            token.jwt = user.jwt;
            token.sub = user.user.email;
            token.id = user.user.id;
            token.name = user.user.name;
            token.email = user.user.email;
          }
        }
      }
      return Promise.resolve(token);
    },
  },
};

const Auth = (req, res) => {
  console.log(119, req.query, req.body);
  return NextAuth(req, res, options);
};

export default Auth;
