import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Link from 'next/link';

/**
 *
 * @param {Object} props
 * @param {"items"|"resources"|"articles"} props.contentType
 * @param {'freecycling'|'resources'|'shops'|''} props.subCategory
 * @param {number} props.contentId
 * @param {string} props.className
 * @returns
 */
export const BookmarkButton = ({
  contentType,
  slug,
  contentId,
  subCategory = '',
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
        body: JSON.stringify({
          contentId,
          subCategory,
        }),
      });
      if (res.ok) {
        setLoading(false);
        setBookmarked(!bookmarked);
      } else {
        setLoading(false);
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
      {authStatus !== 'authenticated' && loading === false && (
        <Link href="/register" passHref>
          <a
            className={`${className} group text-base text-blue leading-none !flex justify-center items-center`}>
            <i className={`${bookmarked ? 'fas' : 'far'} fa-bookmark`} />
          </a>
        </Link>
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
