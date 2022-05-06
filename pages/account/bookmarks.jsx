import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import Layout from '../../components/Layout';

export default function Page({ ...props }) {
  const { data: session, status: authStatus } = useSession();
  const [bookmarks, setBookmarks] = useState({});

  const separateBookmarks = (bookmarks, result) => {
    bookmarks.forEach((bookmark) => {
      ['article', 'item', 'commercial', 'resource'].forEach((type) => {
        if (bookmark.hasOwnProperty(type)) {
          if (typeof result[type] === 'undefined') {
            result[type] = [];
          }
          result[type].push(bookmark);
        }
      });
    });
    setBookmarks(result);
  };

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

  return <Layout>Bookmarks</Layout>;
}
