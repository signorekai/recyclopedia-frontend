import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';

import AccountHeader from '../../components/AccountHeader';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import {
  AccordionHeader,
  AccordionProvider,
  AccordionBody,
} from '../../components/Accordion';

export default function Page({ ...props }) {
  const { data: session, status: authStatus } = useSession();
  const [bookmarks, setBookmarks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      const bookmarkResponse = await fetch(`/api/bookmarks`);
      const bookmarks = await bookmarkResponse.json();
      setLoading(false);
      setBookmarks(bookmarks);
    };
    if (authStatus === 'authenticated' && Object.keys(bookmarks).length === 0)
      fetchBookmarks();
  }, [authStatus, session]);

  const [headerTabs, contentTabs] = useMemo(() => {
    const headerTabs = [];
    const contentTabs = {};

    const labels = {
      item: 'Items',
      resources: 'Resources',
      donate: 'Donations & Charities',
      shops: 'Shops',
      article: 'News & Tips',
    };

    const slugs = {
      item: 'items',
      resources: 'resources',
      donate: 'donate',
      shops: 'shops',
      article: 'articles',
    };

    for (const [type, value] of Object.entries(labels)) {
      if (bookmarks.hasOwnProperty(type)) {
        headerTabs.push(value);

        const items = bookmarks[type];
        contentTabs[value] = (
          <div className="container relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 lg:gap-x-4 gap-y-4 lg:gap-y-6 mt-6 ">
              {items &&
                items.map((item, itemKey) => {
                  let backgroundImage;

                  switch (type) {
                    case 'item':
                    case 'resources':
                    case 'donate':
                    case 'shops':
                      backgroundImage = item.images[0]?.formats.large
                        ? item.images[0]?.formats.large.url
                        : item.images[0]?.url;
                      break;

                    case 'article':
                      backgroundImage = item.coverImage.formats.large
                        ? item.coverImage.formats.large.url
                        : item.coverImage.url;
                      break;
                  }
                  return (
                    <Card
                      key={itemKey}
                      className="w-full"
                      uniqueKey={`card-${itemKey}`}
                      content={{
                        backgroundImage,
                        headerText: item.title,
                        slug: item.slug,
                        contentType: slugs[type],
                      }}
                    />
                  );
                })}
            </div>
          </div>
        );
      }
    }
    return [headerTabs, contentTabs];
  }, [bookmarks]);

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
      {loading === false && Object.keys(bookmarks).length > 0 && (
        <AccordionProvider headers={headerTabs}>
          <AccordionHeader
            className="mt-6"
            carouselClassName="scroll-px-4"
            sliderClassName="lg:max-w-screen-lg mx-auto px-6"
          />
          <AccordionBody {...contentTabs} />
        </AccordionProvider>
      )}
    </Layout>
  );
}
