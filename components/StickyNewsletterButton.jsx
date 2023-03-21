import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import mailIcon from '../assets/img/mail.svg';
import { useWindowDimensions } from '../lib/hooks';

export default function StickyNewsletterButton() {
  const { isDesktop } = useWindowDimensions();
  const [showBtn, setShowBtn] = useState(false);

  const setCookie = (cname, cvalue, expiring) => {
    const d = new Date();
    d.setTime(d.getTime() + expiring * 24 * 60 * 60 * 1000);
    let expires = 'expires=' + d.toUTCString();
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/;`;
    // document.cookie = cname + '=' + cvalue + ';' + expiring + ';path=/';
  };

  useEffect(() => {
    // https://www.w3schools.com/js/js_cookies.asp
    const _handleScroll = () => {
      const hasCookie = (cname) => {
        let name = cname + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return true;
            // return c.substring(name.length, c.length);
          }
        }
        return false;
      };

      if (hasCookie('hideStickyBtn') === false) {
        setShowBtn(true);
      }
    };
    window.addEventListener('scroll', _handleScroll);

    return () => window.removeEventListener('resize', _handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {showBtn && (
        <motion.div
          initial={{
            y: isDesktop ? '0%' : '100%',
            x: isDesktop ? '-100%' : '0%',
            opacity: 0,
          }}
          animate={{ y: '0%', x: '0%', opacity: 1 }}
          exit={{
            y: isDesktop ? '0%' : '100%',
            x: isDesktop ? '-100%' : '0%',
            opacity: 0,
          }}
          className="sticky-btn">
          <Link passHref href="/newsletter">
            <a
              onClick={() => {
                setCookie('hideStickyBtn', true, 14);
                setShowBtn(false);
              }}
              className="text-white hover:text-grey-light no-underline w-auto flex flex-row items-center gap-x-4 p-2 px-4">
              <div className="inline-flex flex-shrink-0 items-center">
                <Image
                  src={mailIcon}
                  width={isDesktop ? 32 : 24}
                  height={isDesktop ? 32 : 24}
                  alt=""
                />
              </div>
              <span>
                <span className="md:block">Subscribe to</span> our newsletter{' '}
                <i className="far fa-arrow-right ml-1 md:hidden"></i>
              </span>
            </a>
          </Link>
          <button
            onClick={() => {
              setCookie('hideStickyBtn', true, 14);
              setShowBtn(false);
            }}
            className="self-end p-2 px-4 md:absolute top-0 right-0">
            <i className="fal fa-times text-grey-light hover:text-grey transition-all text-lg"></i>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
