import { useSession, signOut, signIn } from 'next-auth/react';
import Head from 'next/head';
import { useEffect } from 'react';

import Layout from '../../components/Layout';
import { capitalise } from '../../lib/functions';

export default function Page({ ...props }) {
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
      {authStatus === 'authenticated' && (
        <section className="bg-teal">
          <div className="container container--lg py-4 lg:py-12 flex flex-col md:flex-row justify-between">
            <h3 className="text-white">
              Hi {session && capitalise(session.user.name)}
            </h3>
            <div className="text-right text-white">
              <button onClick={() => signOut({ callbackUrl: '/' })}>
                <i className="far fa-sign-out" /> Logout
              </button>
            </div>
          </div>
        </section>
      )}
      {authStatus === 'loading' && (
        <section className="w-full flex justify-center items-center">
          <i className="fas fa-spinner text-5xl text-grey animate-spin"></i>
        </section>
      )}
    </Layout>
  );
}
