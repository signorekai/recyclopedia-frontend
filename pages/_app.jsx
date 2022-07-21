import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';

import { logVisit } from '../lib/analytics';
import '../styles/fontawesome.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  useEffect(() => {
    logVisit();
    router.events.on('routeChangeComplete', logVisit);
    return () => {
      router.events.off('routeChangeComplete', logVisit);
    };
  }, []);

  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <NextNProgress
        color="#28C9AA"
        showOnShallow={false}
        options={{ showSpinner: false }}
      />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
