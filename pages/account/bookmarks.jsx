import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import AccountHeader from '../../components/AccountHeader';
import Layout from '../../components/Layout';

export default function Page({ ...props }) {
  const { data: session, status: authStatus } = useSession();
  const [bookmarks, setBookmarks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      console.log('FETCHING');
      const bookmarkResponse = await fetch(`/api/bookmarks`);
      const bookmarks = await bookmarkResponse.json();
      if (bookmarks) {
        console.log('GOT RESULTS', bookmarks);
        separateBookmarks(bookmarks, {});
        // setBookmarks(result);
      }
    };
    if (authStatus === 'authenticated') fetchBookmarks();
  }, [authStatus, session]);

  // const [headerTabs, contentTabs] = useMemo(() => {

  // }, [bookmarks]);

  console.log(bookmarks);

  return (
    <Layout
      mainStyle={{
        display: loading ? 'flex' : 'block',
        flexDirection: 'column',
      }}
      footerStyle={{ marginTop: 0 }}>
      <Head>
        <title>Recyclopedia - Your bookmarks</title>
      </Head>
      <AccountHeader session={session} authStatus={authStatus} />
      {loading === true && (
        <section className="flex flex-1 justify-center items-center">
          <i className="fas fa-spinner text-5xl text-grey animate-spin"></i>
        </section>
      )}
    </Layout>
  );
}
