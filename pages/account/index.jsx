import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
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
    <Layout>
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
    </Layout>
  );
}
