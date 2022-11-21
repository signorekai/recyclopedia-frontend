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
import BookmarkButton from '../../components/BookmarkButton';

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
      freecycling: 'Freecycling',
      donate: 'Freecycling',
      shops: 'Shops',
      article: 'News & Tips',
    };

    const slugs = {
      item: 'items',
      resources: 'resources',
      freecycling: 'freecycling',
      donate: 'freecycling',
      shops: 'shops',
      article: 'articles',
    };

    for (const [type, value] of Object.entries(labels)) {
      if (bookmarks && bookmarks.hasOwnProperty(type)) {
        const items = bookmarks[type];

        if (items.length > 0 && items[0] !== null) {
          if (headerTabs.indexOf(value) === -1) {
            headerTabs.push(value);
          }
          contentTabs[value] = (
            <div className="container relative z-10">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 lg:gap-x-4 gap-y-4 lg:gap-y-6 mt-6 ">
                {items &&
                  items.map((item, itemKey) => {
                    let image, bookmarkContentType, bookmarkSubCategory;
                    if (item !== null) {
                      switch (type) {
                        case 'item':
                        case 'resources':
                        case 'freecycling':
                        case 'donate':
                        case 'shops':
                          bookmarkContentType = `resources`;
                          image = item.images ? item.images[0] : {};
                          break;
                        case 'article':
                          image = item.coverImage ? item.coverImage : {};
                          break;
                      }
                      if (type === 'item' || type === 'article') {
                        bookmarkContentType = `${type}s`;
                      } else if (type === 'freecycling' || type === 'shops') {
                        bookmarkSubCategory = type;
                      }

                      return (
                        <Card
                          key={itemKey}
                          className="w-full"
                          uniqueKey={`card-${itemKey}`}
                          bookmarkBtn={
                            <BookmarkButton
                              className="page-icon-wrapper absolute top-4 right-4 z-30"
                              contentType={bookmarkContentType}
                              subCategory={bookmarkSubCategory}
                              contentId={item.id}
                              slug={item.slug}
                            />
                          }
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
    }
    return [headerTabs, contentTabs];
  }, [bookmarks]);

  return (
    <Layout
      title="Your Bookmarks"
      mainStyle={{
        display: loading ? 'flex' : 'block',
        flexDirection: 'column',
      }}
      footerStyle={{ marginTop: 0 }}>
      <AccountHeader
        session={session}
        authStatus={authStatus}
        extraLink={
          <Link href="/account">
            <a className="text-white hover:text-white !no-underline hover:opacity-70">
              <i className="far fa-cog mr-1" />
              Account Settings
            </a>
          </Link>
        }
      />
      <div className="container mt-8">
        <h1 className="text-black">Bookmarks</h1>
      </div>
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
        <section className="mt-20 mx-auto max-w-md text-center text-lg">
          <img src="/img/404.svg" alt="" className="mx-auto block mb-8" />
          You do not have any bookmarks saved!
          <br />
          Learn how to create a bookmark at the{' '}
          <Link href="/faq">
            <a className="text-blue inline">FAQ</a>
          </Link>
          .
        </section>
      )}
    </Layout>
  );
}
