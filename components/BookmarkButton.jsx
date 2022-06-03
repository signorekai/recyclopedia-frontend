import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export const BookmarkButton = ({
  contentType,
  slug,
  className = 'page-icon-wrapper',
}) => {
  const { status: authStatus } = useSession();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const animControl = useAnimation();

  const _handleClick = async () => {
    if (authStatus === 'authenticated') {
      setLoading(true);
      const res = await fetch(`/api/bookmarks/${contentType}/${slug}`, {
        method: bookmarked ? 'DELETE' : 'POST',
      });
      if (res.ok) {
        setLoading(false);
        setBookmarked(!bookmarked);
      }
    }
  };

  useEffect(() => {
    if (authStatus === 'authenticated') {
      const fetchStatus = async () => {
        const res = await fetch(`/api/bookmarks/${contentType}/${slug}`);
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
  }, [authStatus, contentType, slug]);

  return (
    <>
      {authStatus === 'authenticated' && loading === false && (
        <button
          onClick={_handleClick}
          className={`${className} group text-base text-blue leading-none`}>
          <motion.i
            animate={animControl}
            className={`${bookmarked ? 'fas' : 'far'} fa-bookmark`}
          />
        </button>
      )}
      {authStatus === 'authenticated' && loading === true && (
        <div className={`${className}`}>
          <i className="far fa-spinner text-grey animate-spin" />
        </div>
      )}
    </>
  );
};

export default BookmarkButton;
