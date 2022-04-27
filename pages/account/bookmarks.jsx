import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import Layout from '../../components/Layout';

export default function Page({ ...props }) {
  const { data: session, status: authStatus } = useSession();
  const [bookmarks, setBookmarks] = useState({});
  useEffect(() => {
    const fetchBookmarks = async () => {
      const bookmarkResponse = await fetch(`/api/bookmarks`);
      const result = await bookmarkResponse.json();
      setBookmarks(result);
    };
    if (authStatus === 'authenticated') fetchBookmarks();
  }, [authStatus, session]);

  console.log(bookmarks);
  return <Layout>Bookmarks</Layout>;
}
