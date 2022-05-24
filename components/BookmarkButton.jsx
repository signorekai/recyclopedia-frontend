import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const BookmarkButton = ({ contentType, slug }) => {
  const { data: session, status: authStatus } = useSession();
  const [bookmarked, setBookmarked] = useState(false);

  const _handleClick = async () => {
    if (authStatus === 'authenticated') {
      const res = await fetch(`/api/bookmarks/${contentType}/${slug}`, {
        method: bookmarked ? 'DELETE' : 'POST',
      });
      if (res.ok) {
        setBookmarked(!bookmarked);
      }
    }
  };

  useEffect(() => {
    if (authStatus === 'authenticated') {
      const fetchStatus = async () => {
        const res = await fetch(`/api/bookmarks/${contentType}/${slug}`);
        console.log(21, res);
        if (res.ok) {
          const result = await res.json();
          if (result.data && result.data.length > 0) {
            setBookmarked(true);
          }
        } else {
          throw new Error(res.status);
        }
      };

      fetchStatus().catch(console.error);
    }
  }, [authStatus]);

  return (
    <>
      {authStatus === 'authenticated' && (
        <button
          onClick={_handleClick}
          className="page-icon-wrapper text-base text-blue leading-none">
          <i className={`${bookmarked ? 'fas' : 'far'} fa-bookmark`}></i>
        </button>
      )}
    </>
  );
};

export default BookmarkButton;
