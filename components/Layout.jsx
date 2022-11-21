import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import useSWR from 'swr';

import Link from './Link';
import { capitalise } from '../lib/functions';
import Header from './Header';
import { SWRFetcher, useWindowDimensions } from '../lib/hooks';
import { _cacheSearchTerm, Suggestion } from './SearchBar';

const menu = [
  { label: 'Items', href: '/items' },
  { label: 'Resources', href: '/resources' },
  { label: 'Freecycling', href: '/freecycling' },
  { label: 'Shops', href: '/shops' },
  {
    label: 'Learn',
    href: '/learn',
    className: 'divider-b-wider lg:after:hidden',
  },
  { label: 'FAQ', href: '/faq', className: 'lg:ml-2' },
  { label: 'About&nbsp;Us', href: '/about-us' },
  { label: 'Newsletter', href: '/newsletter', className: 'lg:hidden' },
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
    return <Link href="/account/bookmarks">{children}</Link>;
  } else {
    return children;
  }
};

const Layout = ({
  title = '',
  mainStyle = {},
  footerStyle = {},
  children,
  showHeaderInitially = true,
  showHeaderOn = 'UP',
  hideHeaderOn = 'DOWN',
  headerContainerStyle = {},
  ...props
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [formValue, setFormValue] = useState('');

  const suggestions = useRef([]);

  const { width } = useWindowDimensions();
  const router = useRouter();
  const searchBar = useRef();
  const formRef = useRef();

  const { data: session, status: authStatus } = useSession();
  const { data: settings, error } = useSWR('/api/settings', SWRFetcher);

  const _handleFormUpdate = (e) => {
    setFormValue(e.target.value);
  };

  const _handleMenuBtn = () => {
    setShowSearchBar(false);
    setShowMenu(!showMenu);
  };

  const _handleSearchBtn = () => {
    setShowSearchBar(!showSearchBar);
    setShowMenu(false);
  };

  useEffect(() => {
    if (showMenu === false) {
      document.querySelector('body').classList.remove('overflow-hidden');
    } else {
      document.querySelector('body').classList.add('overflow-hidden');
    }
  }, [showMenu]);

  useEffect(() => {
    if (showSearchBar && searchBar) {
      searchBar.current.focus();
    }
  }, [showSearchBar, searchBar]);

  useEffect(() => {
    if (localStorage) {
      const cached = localStorage.getItem(
        ['items', 'resources', 'articles', 'freecycling', 'shops'].join(','),
      );
      if (cached !== null && cached.length > 0)
        suggestions.current = cached.split(',');
    }

    [...document.querySelectorAll('a')].map((link) => {
      const href = link.getAttribute('href');
      if (href !== null && href.startsWith('http')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(href, '_blank');
        });
      }
    });
  }, []);

  const _handleSubmit = (e) => {
    if (formValue.length === 0) {
      e.preventDefault();
    } else {
      _cacheSearchTerm(formValue, 'all');
    }
  };

  const _handleOnBlur = (e) => {
    if (width >= 1080) setIsFocused(false);
    if (e.relatedTarget) {
      // console.log(e.relatedTarget);
      e.relatedTarget.click();
    }

    setTimeout(() => {
      setShowSearchBar(false);
    }, 100);
  };

  const _selectSuggestion = (suggestion) => {
    setFormValue(suggestion);
    setTimeout(() => {
      formRef.current.submit();
    }, 100);
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/img/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/img/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/img/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/img/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/img/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/img/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/img/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/img/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/img/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/img/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/img/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/img/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/img/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/img/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta
          name="description"
          content="Everything you need to know when you have something to throw. A Singapore based directory of recommendations and advice on reducing your waste-karma with info on donation drives, recycle options, thrift shops, and more."
        />
        <meta
          name="og:description"
          content="Everything you need to know when you have something to throw. A Singapore based directory of recommendations and advice on reducing your waste-karma with info on donation drives, recycle options, thrift shops, and more."
        />
        <meta
          name="og:title"
          content={`Recyclopedia.sg${title.length > 0 ? ` - ${title}` : ''}`}
        />
        <title>Recyclopedia.sg{title.length > 0 ? ` - ${title}` : ''}</title>
        <meta
          name="og:image"
          content={`${process.env.NEXT_PUBLIC_LOCATION}/img/cover-image.jpg`}
        />
      </Head>
      <Header
        containerStyle={{
          ...headerContainerStyle,
          zIndex: isFocused ? 60 : 40,
        }}
        showHeaderInitially={showHeaderInitially}
        showHeaderOn={showHeaderOn}
        hideHeaderOn={hideHeaderOn}>
        <div className="overflow-hidden h-full pl-4 lg:pl-0 flex-1 container mx-auto">
          <div
            className={`flex flex-col h-[200%] relative ease-in-out transition-transform duration-200 ${
              showSearchBar ? 'translate-y-0' : '-translate-y-full'
            }`}>
            <div className="flex-1 flex flex-row items-center">
              <div className="hidden lg:inline-block lg:flex-1">
                <Image
                  src="/img/logo.svg"
                  className="h-6"
                  alt=""
                  width={172}
                  height={28}
                />
              </div>
              <form
                ref={formRef}
                method="get"
                onSubmit={_handleSubmit}
                action="/search"
                className="flex-[2]">
                <div className="search-bar-wrapper border-grey-dark text-white">
                  <input
                    autoComplete="off"
                    ref={searchBar}
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    disabled={showSearchBar === false}
                    onBlur={_handleOnBlur}
                    onChange={_handleFormUpdate}
                    value={formValue}
                    placeholder="Search Entire Site"
                    type="text"
                    name="searchTerm"
                    id="searchTerm"
                    className="bg-transparent focus:outline-none flex-1"
                  />
                  <SearchIcon className="pr-2" />
                  <button type="button" onClick={_handleSearchBtn}>
                    <span className="fal fa-times text-xl border-l-1 border-grey-dark pl-4 pr-2 mx-2 pt-1"></span>
                  </button>
                  <input
                    type="hidden"
                    name="contentType"
                    value={[
                      'items',
                      'resources',
                      'articles',
                      'freecycling',
                      'shops',
                    ].join(',')}
                  />
                </div>
              </form>
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
                        <span
                          className={`font-bold ${m.className}`}
                          dangerouslySetInnerHTML={{ __html: m.label }}
                        />
                      );
                    } else {
                      return (
                        <Link key={m.href} href={m.href}>
                          <a
                            className={`${m.className}`}
                            dangerouslySetInnerHTML={{ __html: m.label }}
                          />
                        </Link>
                      );
                    }
                  })}
                </div>
                <div className="icon-wrapper">
                  {authStatus === 'authenticated' && (
                    <BookmarkLink authStatus={authStatus}>
                      <a
                        className="hidden lg:block !text-white"
                        id="bookmark-icon">
                        <span className="far fa-bookmark text-xl"></span>
                      </a>
                    </BookmarkLink>
                  )}
                  <Link
                    href={
                      authStatus === 'authenticated' ? '/account' : '/login'
                    }>
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
                    onClick={_handleSearchBtn}
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
          onClick={_handleMenuBtn}>
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
      </Header>
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { opacity: 0, y: 100 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 100 },
            }}
            className="modal-wrapper !z-50 !flex-col top-0 left-0 !justify-start">
            <motion.div
              transition={{ duration: 0.2 }}
              variants={{
                // initial: { y: '-100%', opacity: 0 },
                // animate: { y: 0, opacity: 1 },
                exit: { y: 50, scale: 0.9 },
              }}
              style={{
                marginTop: width >= 1080 ? 82 : 52,
              }}
              className="search-suggestions lg:max-w-[510px] lg:-translate-x-2 mx-auto">
              <ul className="plain">
                {suggestions.current.map((suggestion, key) => (
                  <Suggestion
                    key={key}
                    selectSuggestion={_selectSuggestion}
                    text={suggestion}
                  />
                ))}
              </ul>
            </motion.div>
            <button
              className="flex-1"
              onClick={() => {
                setIsFocused(false);
              }}></button>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="main" style={mainStyle}>
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
              <div className="flex-1" onClick={_handleMenuBtn}></div>
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
                className="w-7/12 min-w-[220px] max-h-[calc(100vh_-_3rem)] max-w-xs bg-white p-8 flex flex-col text-xl gap-y-3 overflow-y-scroll">
                {menu.map((m) => {
                  if (m.href === router.route) {
                    return (
                      <button
                        onClick={() => {
                          setShowMenu(false);
                        }}
                        className={`text-left font-bold text-blue ${m.className}`}
                        dangerouslySetInnerHTML={{
                          __html: m.label,
                        }}></button>
                    );
                  } else {
                    return (
                      <Link href={m.href} key={m.href} passHref>
                        <motion.a
                          className={`motion-controlled no-underline ${m.className}`}
                          variants={menuLinkVariant}
                          dangerouslySetInnerHTML={{
                            __html: m.label,
                          }}></motion.a>
                      </Link>
                    );
                  }
                })}
                <BookmarkLink authStatus={authStatus}>
                  <a className="text-left no-underline !text-black mb-2">
                    <span className="fas fa-bookmark mr-3" />
                    Bookmarks
                  </a>
                </BookmarkLink>
                {authStatus === 'authenticated' ? (
                  <>
                    <Link href="/account">
                      <a className="-mt-4 no-underline">
                        <i className="far fa-user mr-3"></i>
                        {capitalise(session.user.name)}
                      </a>
                    </Link>
                    <button
                      className="hover:opacity-70 transition-opacity text-left mt-auto"
                      onClick={() => signOut({ callbackUrl: '/' })}>
                      <i className="far fa-sign-out mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login">
                    <a className="-mt-4 text-sm !text-grey-mid no-underline">
                      <i className="far fa-sign-in mr-4" />
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
      <footer className="footer-wrapper" style={footerStyle}>
        <div className="container footer">
          <div className="lg:order-2 flex-1 flex flex-col lg:flex-row lg:justify-between lg:items-center lg:px-10 gap-y-1">
            <span className="text-sm leading-tight">
              A community driven, non-profit initiative
            </span>
            <div className="text-xs flex flex-row gap-x-2">
              <Link href="/newsletter" passHref>
                <a className="text-white no-underline hidden lg:inline hover:text-teal">
                  Subscribe to our Newsletter
                </a>
              </Link>
              <Link href="/privacy-policy" passHref>
                <a className="text-white no-underline hover:text-teal">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms-of-use" passHref>
                <a className="text-white no-underline hover:text-teal">
                  Terms of Use
                </a>
              </Link>
              <span>&copy; Recyclopedia 2022</span>
            </div>
          </div>
          <div className="order-2 lg:order-1">
            {settings && settings.footerSocialIcons && (
              <>
                {settings.footerSocialIcons.map((icon, key) => (
                  <a
                    key={key}
                    href={icon.url}
                    alt={icon.label}
                    className="social-icon"
                    target="_blank"
                    rel="noopener noreferrer">
                    <i className={`fab fa-${icon.icon}`} />
                  </a>
                ))}
              </>
            )}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
