import fetch from 'node-fetch';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

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
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
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
    session: async ({ session, token }) => {
      session.jwt = token.jwt;
      session.user = token;
      return Promise.resolve(session);
    },
    jwt: async ({ token, user, account }) => {
      const isSignIn = user ? true : false;
      if (isSignIn) {
        if (!!account && !!account.provider) {
          if (account.provider !== 'local') {
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

const Auth = (req, res) => NextAuth(req, res, options);

export default Auth;
