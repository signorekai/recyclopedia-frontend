import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import NextNProgress from 'nextjs-progressbar';

import { logVisit } from '../lib/analytics';
import '../styles/fontawesome.css';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  useEffect(() => {
    if (location.hostname === 'recyclopedia-frontend.vercel.app') {
      window.location = `https://recyclopedia.sg${location.pathname}`;
    } else {
      logVisit();
      router.events.on('routeChangeComplete', logVisit);
    }

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
      <GoogleAnalytics trackPageViews />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
