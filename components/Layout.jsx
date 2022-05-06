import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  useAnimation,
  useViewportScroll,
} from 'framer-motion';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useScrollDirection } from 'react-use-scroll-direction';

import { useWindowDimensions } from '../lib/hooks';
import { capitalise } from '../lib/functions';

const menu = [
  { label: 'Items', href: '/items' },
  { label: 'Resources', href: '/resources' },
  { label: 'Donations & Charities', href: '/donate' },
  { label: 'Shops', href: '/shops' },
  {
    label: 'News & Tips',
    href: '/news-tips',
    className: 'divider-b-wider lg:after:hidden',
  },
  { label: 'FAQ', href: '/faq', className: 'lg:ml-2' },
  { label: 'About Us', href: '/about-us' },
  {
    label: 'Feedback',
    href: '/feedback',
    className: 'lg:mr-8 divider-b-wider lg:after:hidden',
  },
];

const menuLinkVariant = {
  initial: { x: 30, opacity: 0 },
  animate: { x: 0, opacity: 1 },
};

const SearchIcon = ({
  className = '',
  showIcon = true,
  onClick = () => {},
}) => {
  return (
    <>
      {showIcon && (
        <button id="search-icon" className={className} onClick={onClick}>
          <svg
            className="w-5 h-5 stroke-current stroke-2"
            fill="none"
            viewBox="0 0 20 20">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.65 16.3a7.65 7.65 0 100-15.3 7.65 7.65 0 000 15.3zM19 19l-4.5-4.5"
            />
          </svg>
        </button>
      )}
    </>
  );
};

const BookmarkLink = ({ authStatus, children }) => {
  if (authStatus === 'authenticated') {
    return <Link href="/bookmarks">{children}</Link>;
  } else {
    return children;
  }
};

export default function Layout({
  children,
  showHeaderInitially = true,
  showHeaderOn = 'DOWN',
  hideHeaderOn = '',
  ...props
}) {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const [showSearchBar, setShowSearchBar] = useState(false);
  const scrolledHeaderVisible = useRef(false);

  const { scrollY } = useViewportScroll();
  const { scrollDirection } = useScrollDirection();
  const { width } = useWindowDimensions();

  const searchBar = useRef();
  const headerControls = useAnimation();

  const { data: session, status: authStatus } = useSession();

  const handleMenuBtn = () => {
    setShowSearchBar(false);
    setShowMenu(!showMenu);
  };

  const handleSearchBtn = () => {
    setShowSearchBar(!showSearchBar);
    setShowMenu(false);
  };

  useEffect(() => {
    if (scrollY.get() > 0) {
      if (scrollDirection === showHeaderOn) {
        if (!scrolledHeaderVisible.current) {
          headerControls.set({
            y: '-110%',
            position: 'sticky',
            display: 'flex',
          });
        }
        scrolledHeaderVisible.current = true;

        headerControls.start({
          y: 0,
          maxHeight: 100,
          transition: {
            duration: 0.2,
          },
        });
      } else if (
        scrollDirection === hideHeaderOn &&
        !showMenu &&
        !showSearchBar &&
        scrollY.get() > 50 &&
        width < 1080
      ) {
        headerControls.start({
          y: '-110%',
          maxHeight: 0,
          overflow: 'hidden',
          transition: {
            duration: 0.2,
          },
        });
      }
    }
    // showHeaderInitially, showHeaderOn, hideHeaderOn will never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollDirection, headerControls, scrollY, showMenu, showSearchBar]);

  useEffect(() => {
    if (showSearchBar && searchBar) {
      searchBar.current.focus();
    }
  }, [showSearchBar, searchBar]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <motion.header
        style={{
          display: showHeaderInitially ? 'flex' : 'none',
        }}
        animate={headerControls}
        className="header">
        <div className="overflow-hidden h-full pl-4 lg:pl-0 flex-1 max-w-[1280px] mx-auto">
          <div
            className={`flex flex-col h-[200%] relative ease-in-out transition-transform duration-200 ${
              showSearchBar ? 'translate-y-0' : '-translate-y-full'
            }`}>
            <div className="flex-1 flex flex-row items-center">
              <div className="hidden lg:inline-block lg:flex-1">
                <img src="/img/logo-mini.svg" width={42} height={19} alt="" />
              </div>
              <div className="search-bar-wrapper border-grey-dark text-white">
                <input
                  ref={searchBar}
                  placeholder="Search Entire Site"
                  type="text"
                  name=""
                  id=""
                  className="bg-transparent focus:outline-none flex-1"
                />
                <SearchIcon className="" />
                <button onClick={handleSearchBtn}>
                  <span className="fal fa-times text-xl border-l-1 border-grey-dark pl-2 mx-2 pt-1"></span>
                </button>
              </div>
              <div className="hidden lg:inline-block lg:flex-1" />
            </div>
            <div className="header-wrapper">
              <div className="logo-wrapper">
                <Link href="/">
                  <a>
                    <Image
                      src="/img/logo.svg"
                      className="h-6"
                      alt=""
                      width={172}
                      height={28}
                    />
                  </a>
                </Link>
              </div>
              <div className="flex flex-row">
                <div className="desktop-menu-wrapper">
                  {menu.map((m) => {
                    if (m.href === router.route) {
                      return (
                        <span className={`font-bold ${m.className}`}>
                          {m.label}
                        </span>
                      );
                    } else {
                      return (
                        <Link key={m.href} href={m.href}>
                          <a className={`${m.className}`}>{m.label}</a>
                        </Link>
                      );
                    }
                  })}
                </div>
                <div className="icon-wrapper">
                  {authStatus === 'authenticated' && (
                    <Link href="/account/bookmarks">
                      <a
                        className="hidden lg:block !text-white"
                        id="bookmark-icon">
                        <span className="far fa-bookmark text-xl"></span>
                      </a>
                    </Link>
                  )}
                  <Link href="/account">
                    <a
                      className="hidden !text-white lg:flex items-center"
                      id="person-icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="20"
                        fill="none"
                        viewBox="0 0 19 20">
                        <path
                          className="stroke-current stroke-2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.489 10.665a4.832 4.832 0 100-9.665 4.832 4.832 0 000 9.665zM1 18.086c0-2.491 2.157-7.421 6.634-7.421h3.732c4.477 0 6.634 4.93 6.634 7.421H1z"></path>
                      </svg>
                    </a>
                  </Link>
                  <SearchIcon
                    onClick={handleSearchBtn}
                    className="!mr-[-0.1rem]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          className={`lg:hidden group px-2 mr-2 pt-4 pb-3`}
          id="menu-icon"
          onClick={handleMenuBtn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            className="w-6 h-6">
            <path
              className={`!stroke-0 fill-white group-hover:fill-teal translate-y-[1px] translate-x-[1px] ${
                showMenu ? 'opacity-0' : ''
              }`}
              d="M21.11 5.078a.522.522 0 00.515-.516V3.188c0-.257-.258-.515-.516-.515H2.891c-.301 0-.516.258-.516.515v1.376c0 .3.215.515.516.515h18.218zm0 6.875a.522.522 0 00.515-.515v-1.376c0-.257-.258-.515-.516-.515H2.891c-.301 0-.516.258-.516.515v1.376c0 .3.215.515.516.515h18.218zm0 6.875a.522.522 0 00.515-.515v-1.375c0-.258-.258-.516-.516-.516H2.891c-.301 0-.516.258-.516.515v1.375c0 .301.215.516.516.516h18.218z"
            />
            <path
              className={`!stroke-0 fill-white group-hover:fill-teal translate-y-6 ${
                showMenu ? '!translate-y-1 translate-x-1' : 'opacity-0'
              }`}
              d="M9.785 8.25l3.621-3.586.739-.738c.105-.106.105-.281 0-.422l-.774-.774c-.14-.105-.316-.105-.422 0L8.625 7.09l-4.36-4.36c-.105-.105-.28-.105-.421 0l-.774.774c-.105.14-.105.316 0 .422L7.43 8.25l-4.36 4.36c-.105.105-.105.28 0 .421l.774.774c.14.105.316.105.422 0l4.359-4.36 3.586 3.621.738.739c.106.105.281.105.422 0l.774-.774c.105-.14.105-.316 0-.422L9.785 8.25z"
            />
          </svg>
        </button>
      </motion.header>
      <main className="main">
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0, pointerEvents: 'none' },
              }}
              className="modal-wrapper top-[50px]">
              <div className="flex-1" onClick={handleMenuBtn}></div>
              <motion.div
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: 0.3,
                  staggerChildren: 0.05,
                }}
                variants={{
                  initial: { x: '100%' },
                  animate: { x: 0 },
                  exit: { x: 0 },
                }}
                className="w-7/12 min-w-[220px] max-w-xs bg-white p-8 flex flex-col text-xl gap-y-6">
                {menu.map((m) => {
                  if (m.href === router.route) {
                    return (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                        }}
                        className={`text-left ${m.className}`}>
                        {m.label}
                      </button>
                    );
                  } else {
                    return (
                      <Link href={m.href} key={m.href} passHref>
                        <motion.a
                          className={`motion-controlled ${m.className}`}
                          variants={menuLinkVariant}>
                          {m.label}
                        </motion.a>
                      </Link>
                    );
                  }
                })}
                <BookmarkLink authStatus={authStatus}>
                  <a className="text-left !text-black">
                    <span className="fas fa-bookmark mr-3" />
                    Bookmarks
                  </a>
                </BookmarkLink>
                {authStatus === 'authenticated' ? (
                  <Link href="/account">
                    <a className="-mt-4">{capitalise(session.user.name)}</a>
                  </Link>
                ) : (
                  <Link href="/signin">
                    <a className="-mt-4 text-sm !text-grey-mid">
                      Login to access
                    </a>
                  </Link>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </main>
      <footer className="bg-blue-dark text-white mt-7">
        <div className="container container--wide footer">
          <div className="lg:order-2 flex-1 flex flex-col lg:flex-row lg:justify-between lg:items-center lg:px-10">
            <span className="text-sm leading-tight">
              A community driven, non-profit initiative
            </span>
            <span className="text-xs">
              &copy; 2022 Recyclopedia. All rights reserved.
            </span>
          </div>
          <div className="order-2 lg:order-1">
            <a
              href="https://facebook.com"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fab fa-facebook" />
            </a>
            <a
              href="https://instagram.com"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fab fa-instagram" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
