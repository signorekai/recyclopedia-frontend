import { useSession } from 'next-auth/react';

import Layout from '../../components/Layout';
import { capitalise } from '../../lib/functions';

export default function Page({ ...props }) {
  const { data: session, status: authStatus } = useSession();
  console.log(88, session, authStatus);
  return <Layout>Hi {session && capitalise(session.user.name)}</Layout>;
}
