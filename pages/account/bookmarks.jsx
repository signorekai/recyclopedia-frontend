import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import useSWR from 'swr';

import Link from '../../components/Link';
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

  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: bookmarks, error } = useSWR('/api/bookmarks', fetcher);
  const loading = !error && !bookmarks;

  const [headerTabs, contentTabs] = useMemo(() => {
    const headerTabs = [];
    const contentTabs = {};

    const labels = {
      item: 'Items',
      resources: 'Resources',
      donate: 'Charities',
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
      if (bookmarks && bookmarks.hasOwnProperty(type)) {
        headerTabs.push(value);
        const items = bookmarks[type];
        contentTabs[value] = (
          <div className="container relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 lg:gap-x-4 gap-y-4 lg:gap-y-6 mt-6 ">
              {items &&
                items.map((item, itemKey) => {
                  let image;
                  if (item !== null) {
                    switch (type) {
                      case 'item':
                      case 'resources':
                      case 'donate':
                      case 'shops':
                        image = item.images ? item.images[0] : {};
                        break;
                      case 'article':
                        image = item.coverImage ? item.coverImage : {};
                        break;
                    }
                    return (
                      <Card
                        key={itemKey}
                        className="w-full"
                        uniqueKey={`card-${itemKey}`}
                        content={{
                          image,
                          headerText: item.title,
                          slug: item.slug,
                          contentType: slugs[type],
                        }}
                      />
                    );
                  }
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
      <AccountHeader
        session={session}
        authStatus={authStatus}
        extraLink={
          <Link href="/account">
            <a className="text-white">
              <i className="far fa-cog mr-1" />
              Account Settings
            </a>
          </Link>
        }
      />
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
      {loading === false && Object.keys(bookmarks).length === 0 && (
        <p className="text-lg text-center mt-8 lg:mt-16">
          You do not have any bookmarks saved!
          <br />
          Learn how to create a bookmark at the{' '}
          <Link href="/faq">
            <a className="text-blue">FAQ</a>
          </Link>
        </p>
      )}
    </Layout>
  );
}
