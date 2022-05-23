import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token, ...props }) => {
      console.log(token, props);
      return token !== null;
    },
  },
});
