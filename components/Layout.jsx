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
import Logo from './Logo';
import { SWRFetcher, useWindowDimensions } from '../lib/hooks';
import { _cacheSearchTerm, Suggestion } from './SearchBar';
import StickyNewsletterButton from './StickyNewsletterButton';

const menuWithDropdown = [
  {
    label: 'Browse',
    items: [
      {
        label: 'Items',
        href: '/items',
        icon: 'box',
        colour: '#28c9aa',
      },
      {
        label: 'Freecycling',
        href: '/freecycling',
        icon: 'box-heart',
        colour: '#ff6153',
      },
      {
        label: 'Resources',
        href: '/resources',
        icon: 'recycle',
        colour: '#224dbf',
      },
      {
        label: 'Shops',
        href: '/shops',
        icon: 'shopping-bag',
        colour: '#707075',
        className: 'divider-b-wider lg:after:hidden',
      },
    ],
  },
  {
    label: 'Donation Drives',
    href: '/articles?section=Donation%20Drives',
  },
  {
    label: 'Blog',
    href: '/articles',
    className: 'divider-b-wider lg:after:hidden',
  },
  {
    label: 'About Us',
    items: [
      {
        label: 'Who We Are',
        href: '/about-us',
      },
      {
        label: 'FAQ',
        href: '/faq',
      },
      {
        label: 'Newsletter',
        href: '/newsletter',
      },
      {
        label: 'Contact Us',
        href: '/feedback',
        className: 'divider-b-wider lg:after:hidden',
      },
    ],
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
          <i className="far fa-search search-icon"></i>
        </button>
      )}
    </>
  );
};

const BookmarkLink = ({ children }) => {
  return <Link href="/account/bookmarks">{children}</Link>;
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
    if (showMenu === false && isFocused === false) {
      document.querySelector('body').classList.remove('overflow-hidden');
    } else {
      document.querySelector('body').classList.add('overflow-hidden');
    }
  }, [showMenu, isFocused]);

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
          name="og:title"
          key="og:title"
          content={`${title.length > 0 ? `${title} | ` : ''}Recyclopedia.sg`}
        />
        <title>{title.length > 0 ? `${title} | ` : ''}Recyclopedia.sg</title>
        <meta
          name="og:image"
          key="og:image"
          content={`${process.env.NEXT_PUBLIC_LOCATION}/img/cover-image.jpg`}
        />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_LOCATION}${router.asPath}`}
          key="canonical"
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
        <div className="h-full py-4 lg:py-0 pl-4 pr-0 lg:pr-4 lg:pl-0 flex-1 container container--lg mx-auto">
          <div className="header-wrapper">
            <div className="logo-wrapper">
              <Link href="/">
                <a>
                  <Logo />
                </a>
              </Link>
            </div>
            <div className="flex flex-row items-center h-full">
              <div className="desktop-menu-wrapper">
                {menuWithDropdown.map((m) => {
                  if (m.hasOwnProperty('items')) {
                    return (
                      <div className="has-dropdown group">
                        <span dangerouslySetInnerHTML={{ __html: m.label }} />
                        <i className="fal fa-chevron-down pl-2 text-xs"></i>
                        <i className="fal fa-chevron-up pl-2 text-xs"></i>
                        <ul className="submenu group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto">
                          {m.items.map((i) => (
                            <li key={i.href} className="group/menu">
                              <Link href={i.href}>
                                <a
                                  className={`${
                                    i.hasOwnProperty('className')
                                      ? i.className
                                      : ''
                                  }`}>
                                  <span
                                    className={`${
                                      i.hasOwnProperty('colour')
                                        ? 'group-hover/menu:hidden'
                                        : 'group-hover/menu:text-grey-hover'
                                    }`}>
                                    {i.icon && (
                                      <i
                                        className={`far fa-${i.icon} text-lg pr-2`}
                                      />
                                    )}
                                    <span
                                      className="font-bold"
                                      dangerouslySetInnerHTML={{
                                        __html: i.label,
                                      }}
                                    />
                                  </span>
                                  {i.hasOwnProperty('colour') && (
                                    <span
                                      className="hidden group-hover/menu:inline"
                                      style={{
                                        color: i.colour,
                                      }}>
                                      {i.icon && (
                                        <i
                                          className={`far fa-${i.icon} text-lg pr-2`}
                                        />
                                      )}
                                      <span
                                        className="font-bold"
                                        dangerouslySetInnerHTML={{
                                          __html: i.label,
                                        }}
                                      />
                                    </span>
                                  )}
                                </a>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  } else {
                    return (
                      <Link key={m.href} href={m.href}>
                        <a className={`${m.className}`}>
                          {m.icon && (
                            <i className={`far fa-${m.icon} text-lg pr-2`} />
                          )}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: m.label,
                            }}
                          />
                        </a>
                      </Link>
                    );
                  }
                })}
                <Link href="/account/bookmarks">
                  <a className="hidden lg:block !text-white" id="bookmark-icon">
                    <i className="far fa-bookmark text-xl"></i>
                  </a>
                </Link>
                <Link
                  href={authStatus === 'authenticated' ? '/account' : '/login'}>
                  <a className="!text-white" id="person-icon">
                    <i className="far fa-user text-xl"></i>
                  </a>
                </Link>
              </div>
              <form
                ref={formRef}
                method="get"
                onSubmit={_handleSubmit}
                action="/search"
                className={`new-search-container ${
                  !isFocused && width < 1080 ? '-translate-y-20 opacity-0' : ''
                }`}>
                <div className="new-search-wrapper">
                  <input
                    autoComplete="off"
                    ref={searchBar}
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onBlur={_handleOnBlur}
                    onChange={_handleFormUpdate}
                    value={formValue}
                    placeholder="Search for something"
                    type="text"
                    name="searchTerm"
                    id="searchTerm"
                    className="bg-transparent focus:outline-none flex-1 w-full lg:w-80"
                  />
                  <button type="submit">
                    <span className="far fa-search search-icon text-black ease-in-out px-2"></span>
                  </button>
                  <button
                    onClick={() => {
                      setIsFocused(false);
                    }}
                    className="search-close-btn pr-0 lg:hidden">
                    <span className="fal fa-times search-icon text-black border-l-1 border-bg pl-2"></span>
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
                <AnimatePresence>
                  {isFocused && (
                    <motion.div
                      transition={{ duration: 0.2 }}
                      variants={{
                        initial: { y: '-100%', opacity: 0 },
                        // animate: { y: 0, opacity: 1 },
                        exit: { y: 50, scale: 0.9 },
                      }}
                      className="search-suggestions search-suggestions--top">
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
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <AnimatePresence>
            {!isFocused && (
              <motion.button
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                }}
                className="px-2 text-white lg:hidden"
                onClick={() => {
                  searchBar.current.focus();
                }}>
                <i className="far fa-search search-icon"></i>
              </motion.button>
            )}
          </AnimatePresence>
          <button
            className={`lg:hidden group px-2 mr-2 block h-full text-xl text-white`}
            id="menu-icon"
            onClick={_handleMenuBtn}>
            {showMenu ? (
              <i className="fal fa-times text-3xl"></i>
            ) : (
              <i className="far fa-bars"></i>
            )}
          </button>
        </div>
      </Header>
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{
              initial: { opacity: 0, y: -20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -20 },
            }}
            className="modal-wrapper !z-50 !flex-col top-0 left-0 !justify-start">
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
                {menuWithDropdown.map((m) => {
                  if (m.hasOwnProperty('items')) {
                    return (
                      <>
                        {m.items.map((i) => (
                          <Link key={i.href} href={i.href}>
                            <a
                              className={`${
                                i.hasOwnProperty('className') ? i.className : ''
                              } no-underline`}>
                              <span
                                className=""
                                style={{
                                  color: i.colour,
                                }}>
                                {i.icon && (
                                  <i className={`far fa-${i.icon} pr-2`} />
                                )}
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: i.label,
                                  }}
                                />
                              </span>
                            </a>
                          </Link>
                        ))}
                      </>
                    );
                  } else {
                    return (
                      <Link key={m.href} href={m.href}>
                        <a className={`${m.className} no-underline`}>
                          {m.icon && (
                            <i className={`far fa-${m.icon} text-lg pr-2`} />
                          )}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: m.label,
                            }}
                          />
                        </a>
                      </Link>
                    );
                  }
                })}
                <Link href="/account/bookmarks">
                  <a className="hidden lg:block !text-white" id="bookmark-icon">
                    <i className="far fa-bookmark text-xl"></i>
                  </a>
                </Link>
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
                    <a className="-mt-4 !text-grey-mid no-underline">
                      <i className="far fa-user mr-3" />
                      Login
                    </a>
                  </Link>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {children}
      </main>
      <StickyNewsletterButton />
      <footer className="footer-wrapper" style={footerStyle}>
        <div className="container footer">
          <div className="lg:order-2 flex-1 flex flex-col lg:flex-row lg:justify-between lg:items-center lg:px-10 gap-y-1">
            <span className="text-sm leading-tight mt-1">
              A community driven, non-profit initiative
            </span>
            <div className="text-xs flex flex-row gap-x-2 flex-wrap mt-2">
              <Link href="/newsletter" passHref>
                <a className="text-white py-1 no-underline hover:text-teal font-bold">
                  Subscribe to our Newsletter
                </a>
              </Link>
              <Link href="/privacy-policy" passHref>
                <a className="text-white py-1 no-underline hover:text-teal font-bold">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/terms-of-service" passHref>
                <a className="text-white py-1 no-underline hover:text-teal font-bold">
                  Terms of Service
                </a>
              </Link>
              <span className="py-1">&copy; Recyclopedia 2022</span>
            </div>
          </div>
          <div className="order-2 lg:order-1 -mt-1 md:mt-0">
            {settings && settings.footerSocialIcons && (
              <>
                {settings.footerSocialIcons.map((icon, key) => (
                  <a
                    key={key}
                    href={icon.url}
                    alt={icon.label}
                    className="social-icon"
                    target="_blank"
                    title={icon.label}
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
