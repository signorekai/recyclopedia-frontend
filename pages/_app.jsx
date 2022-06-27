import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';

import '../styles/fontawesome.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <NextNProgress color="#28C9AA" showOnShallow={false} />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
