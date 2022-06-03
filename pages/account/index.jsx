import { useSession, signOut, signIn } from 'next-auth/react';
import Head from 'next/head';
import { useEffect } from 'react';
import AccountHeader from '../../components/AccountHeader';

import Layout from '../../components/Layout';

export default function Page() {
  const { data: session, status: authStatus } = useSession();
  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      signIn();
    }
  }, []);

  return (
    <Layout
      mainStyle={{ display: authStatus === 'authenticated' ? 'block' : 'flex' }}
      footerStyle={{ marginTop: 0 }}>
      <Head>
        <title>Recyclopedia - Your account</title>
      </Head>
      <AccountHeader session={session} authStatus={authStatus} />
      {authStatus === 'loading' && (
        <section className="w-full flex justify-center items-center">
          <i className="fas fa-spinner text-5xl text-grey animate-spin"></i>
        </section>
      )}
    </Layout>
  );
}
