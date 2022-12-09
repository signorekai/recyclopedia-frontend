import Head from 'next/head';
import { motion } from 'framer-motion';
import qs from 'qs';

import Mailchimp from '../components/Mailchimp';

import {
  ITEMS_PER_PAGE,
  staticFetcher,
  useWindowDimensions,
} from '../lib/hooks';
import { Carousel, CarouselCard } from '../components/Carousel';
import Layout from '../components/Layout';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';
import Link from '../components/Link';

export default function Home({ items, newsItems, newsletter, donationDrives }) {
  const { width } = useWindowDimensions();

  return (
    <Layout>
      <div className="bg-mobile-banner md:bg-banner bg-no-repeat bg-contain">
        <div className="max-w-md lg:max-w-none pt-40 lg:pt-32 mx-auto">
          <a className="lg:flex justify-center z-10 relative hidden">
            <svg
              className="aspect-[305_/_50]"
              width="305"
              viewBox="0 0 172 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g className="fill-blue">
                <path d="M35.4836 18.1012L36.6258 19.7765C35.9286 20.4236 35.1095 20.927 34.2157 21.2575C33.322 21.588 32.3712 21.7391 31.4184 21.7022C30.4391 21.7472 29.4614 21.5832 28.5509 21.2213C27.6405 20.8594 26.8185 20.3079 26.1401 19.6038C25.4616 18.8998 24.9425 18.0595 24.6175 17.1394C24.2925 16.2192 24.1692 15.2406 24.2559 14.2691C24.2559 9.87857 26.7531 6.79749 31.0506 6.79749C34.4964 6.79749 36.8581 8.72319 36.8581 12.1316C36.8804 13.1459 36.6546 14.1505 36.1999 15.0587H26.9854C26.9541 15.6661 27.0524 16.2733 27.2736 16.8403C27.4949 17.4073 27.8342 17.9213 28.2693 18.3487C28.7044 18.776 29.2254 19.107 29.7981 19.3199C30.3709 19.5328 30.9825 19.6228 31.5927 19.584C32.3085 19.6131 33.0228 19.4967 33.6919 19.2417C34.3609 18.9867 34.9706 18.5986 35.4836 18.1012ZM27.1015 13.21H34.206C34.2943 12.8965 34.3398 12.5727 34.3415 12.2472C34.3703 11.8107 34.3047 11.3732 34.1493 10.9641C33.9938 10.5549 33.752 10.1837 33.4402 9.87534C33.1284 9.56698 32.7538 9.32873 32.3416 9.17648C31.9294 9.02424 31.4892 8.96158 31.0506 8.99278C28.6889 8.99278 27.4113 10.6874 27.1015 13.21Z" />
                <path d="M38.7163 14.3462C38.7163 9.95572 41.1361 6.87463 45.5498 6.87463C48.8407 6.87463 51.0863 8.49215 51.0863 11.2844C51.086 11.7342 51.0208 12.1817 50.8927 12.6131L48.4148 12.9211C48.5259 12.5656 48.5846 12.1958 48.589 11.8235C48.6003 11.4353 48.5271 11.0493 48.3746 10.6919C48.222 10.3345 47.9936 10.0141 47.705 9.75256C47.4164 9.49107 47.0744 9.29472 46.7024 9.17688C46.3304 9.05904 45.9373 9.02249 45.5498 9.06981C42.8397 9.06981 41.5039 11.4192 41.5039 14.3462C41.5039 17.2733 43.0526 19.5647 46.0918 19.5647C47.4218 19.5857 48.7072 19.0881 49.6731 18.1783L50.8927 19.8921C49.5149 21.1606 47.6978 21.8505 45.8208 21.8177C44.8418 21.8581 43.8655 21.6892 42.9577 21.3223C42.0499 20.9555 41.2317 20.3992 40.5584 19.6911C39.885 18.983 39.3722 18.1395 39.0545 17.2175C38.7367 16.2954 38.6214 15.3164 38.7163 14.3462Z" />
                <path d="M66.6116 7.12506L61.23 22.3956C60.0491 25.804 58.5005 27.9993 55.3257 27.9993C54.1337 28.0179 52.9603 27.7045 51.938 27.0943L52.8479 25.1686C53.4676 25.5587 54.1859 25.7657 54.9192 25.7655C56.8551 25.7655 57.7649 24.379 58.7909 21.4905H57.5326L51.9187 7.12506H54.745L59.449 19.353H59.662L63.9789 7.12506H66.6116Z" />
                <path d="M67.2699 14.3462C67.2699 9.95572 69.6897 6.87463 74.1034 6.87463C77.3942 6.87463 79.6398 8.49215 79.6398 11.2844C79.6395 11.7342 79.5743 12.1817 79.4462 12.6131L76.9684 12.9211C77.0544 12.5814 77.0935 12.2316 77.0845 11.8813C77.0958 11.4932 77.0226 11.1072 76.87 10.7497C76.7174 10.3923 76.489 10.0719 76.2004 9.81039C75.9118 9.5489 75.5698 9.35255 75.1979 9.23471C74.8259 9.11687 74.4327 9.08032 74.0453 9.12763C71.3351 9.12763 69.9994 11.4769 69.9994 14.404C69.9994 17.331 71.5481 19.6226 74.5873 19.6226C75.9173 19.6435 77.2027 19.1458 78.1686 18.236L79.3881 19.9499C78.0104 21.2184 76.1933 21.9083 74.3163 21.8756C73.3367 21.9085 72.3613 21.732 71.4561 21.3579C70.5509 20.9839 69.7369 20.4212 69.069 19.7075C68.4011 18.9939 67.8949 18.146 67.5845 17.2211C67.2742 16.2962 67.1669 15.3159 67.2699 14.3462Z" />
                <path d="M84.8278 0.0192871V21.5097H82.1177V0.0192871H84.8278Z" />
                <path d="M101.185 14.3462C101.185 18.6983 98.6108 21.7793 94.2745 21.7793C89.9383 21.7793 87.4023 18.6983 87.4023 14.3462C87.4023 9.99423 89.9964 6.87463 94.2745 6.87463C98.5527 6.87463 101.185 9.95572 101.185 14.3462ZM90.1899 14.3462C90.1899 17.3118 91.545 19.5647 94.2745 19.5647C97.004 19.5647 98.3978 17.3118 98.3978 14.3462C98.3978 11.3807 97.0427 9.06981 94.2745 9.06981C91.5063 9.06981 90.1899 11.3615 90.1899 14.3462Z" />
                <path d="M117.485 14.3463C117.485 18.6983 115.143 21.7793 111.31 21.7793C110.302 21.8251 109.304 21.5662 108.447 21.0369C107.59 20.5075 106.915 19.7325 106.509 18.8137V27.7488H103.799V7.12499H106.296V10.3023C106.652 9.2719 107.332 8.38257 108.234 7.76543C109.137 7.1483 110.215 6.83608 111.31 6.87465C115.143 6.87465 117.485 9.95573 117.485 14.3463ZM114.698 14.3463C114.698 11.4 113.304 9.10837 110.594 9.10837C107.883 9.10837 106.528 11.3615 106.528 14.3463C106.528 17.331 107.922 19.5455 110.594 19.5455C113.265 19.5455 114.698 17.2733 114.698 14.3463Z" />
                <path d="M130.533 18.1012L131.675 19.7765C130.979 20.4254 130.16 20.93 129.266 21.2606C128.372 21.5912 127.42 21.7412 126.467 21.7022C125.489 21.744 124.513 21.578 123.604 21.215C122.695 20.852 121.874 20.3004 121.196 19.597C120.518 18.8936 119.999 18.0546 119.673 17.1359C119.347 16.2171 119.221 15.2399 119.305 14.2691C119.305 9.87857 121.802 6.79749 126.1 6.79749C129.545 6.79749 131.907 8.72319 131.907 12.1316C131.926 13.1434 131.707 14.1457 131.268 15.0587H122.054C122.02 15.6652 122.115 16.272 122.334 16.839C122.553 17.406 122.891 17.9203 123.324 18.348C123.758 18.7757 124.278 19.1069 124.85 19.32C125.421 19.533 126.032 19.623 126.642 19.584C127.357 19.6131 128.072 19.4967 128.741 19.2417C129.41 18.9867 130.02 18.5986 130.533 18.1012ZM122.151 13.21H129.352C129.456 12.8998 129.509 12.5744 129.507 12.2472C129.532 11.8098 129.464 11.3719 129.307 10.9628C129.149 10.5537 128.905 10.1827 128.592 9.87475C128.279 9.56675 127.903 9.32881 127.49 9.17672C127.077 9.02463 126.636 8.9619 126.196 8.99278C123.796 8.99278 122.46 10.6874 122.151 13.21Z" />
                <path d="M147.471 0.0192755V21.5097H144.974V18.3709C144.606 19.3907 143.922 20.2682 143.021 20.8771C142.12 21.4861 141.049 21.7952 139.96 21.76C136.088 21.76 133.785 18.679 133.785 14.327C133.785 9.97498 136.127 6.85538 139.96 6.85538C140.968 6.8096 141.966 7.06838 142.823 7.59772C143.679 8.12707 144.355 8.90212 144.761 9.82087V0L147.471 0.0192755ZM144.838 14.3463C144.838 11.3615 143.444 9.10838 140.773 9.10838C138.102 9.10838 136.669 11.4 136.669 14.3463C136.669 17.2925 138.063 19.5455 140.773 19.5455C143.483 19.5455 144.838 17.2733 144.838 14.3463Z" />
                <path d="M150.917 3.19661C150.916 2.96573 150.963 2.73727 151.055 2.52514C151.146 2.313 151.281 2.12166 151.449 1.96297C151.618 1.80429 151.817 1.68153 152.035 1.60226C152.253 1.52299 152.485 1.48889 152.717 1.50201C153.169 1.50201 153.602 1.68055 153.921 1.99835C154.241 2.31615 154.42 2.74717 154.42 3.19661C154.42 3.64604 154.241 4.07706 153.921 4.39486C153.602 4.71266 153.169 4.8912 152.717 4.8912C152.485 4.90432 152.253 4.87022 152.035 4.79095C151.817 4.71168 151.618 4.58892 151.449 4.43024C151.281 4.27155 151.146 4.08033 151.055 3.86819C150.963 3.65606 150.916 3.42748 150.917 3.19661ZM151.342 7.04795H154.053V21.5097H151.342V7.04795Z" />
                <path d="M171.591 21.2401C170.977 21.603 170.273 21.7897 169.558 21.7794C168.834 21.8507 168.111 21.6396 167.54 21.1905C166.97 20.7415 166.597 20.0896 166.5 19.3723C166.005 20.1653 165.301 20.8087 164.466 21.2329C163.63 21.6572 162.693 21.8461 161.757 21.7794C159.105 21.7794 157.092 20.5277 157.092 17.928C157.092 14.6736 160.17 13.8841 162.899 13.576L166.306 13.1715V12.3628C166.306 10.2638 165.377 9.10841 163.383 9.10841C161.873 9.10841 160.654 9.84017 160.654 11.0341C160.656 11.3457 160.722 11.6536 160.847 11.9392L158.466 12.305C158.251 11.8271 158.145 11.3074 158.157 10.7837C158.157 8.37665 160.228 6.9324 163.461 6.9324C164.19 6.83472 164.932 6.9012 165.632 7.1268C166.332 7.3524 166.972 7.73143 167.506 8.23596C168.039 8.74049 168.451 9.35761 168.713 10.0419C168.974 10.7261 169.078 11.46 169.016 12.1894V18.2746C169.016 19.1219 169.404 19.6226 170.139 19.6226C170.413 19.6291 170.682 19.5554 170.914 19.4107L171.591 21.2401ZM166.248 15.7327V15.0588L163.383 15.3861C161.447 15.6172 159.705 16.0216 159.705 17.7739C159.705 19.2374 160.963 19.6996 162.473 19.6996C162.998 19.7382 163.524 19.6603 164.014 19.4715C164.505 19.2826 164.946 18.9876 165.308 18.6078C165.669 18.228 165.941 17.773 166.104 17.2757C166.266 16.7784 166.316 16.2513 166.248 15.7327Z" />
                <path d="M17.4418 19.9114C16.3268 19.7267 15.2445 19.383 14.2283 18.8908C12.9616 18.2774 11.8298 17.4199 10.8987 16.3682C12.4589 16.5507 14.04 16.4252 15.5514 15.9989C17.0629 15.5726 18.4749 14.8539 19.7067 13.884C21.0359 12.867 22.0184 11.4677 22.5205 9.87611C23.0227 8.28449 23.0203 6.57763 22.5136 4.98741C22.0412 3.75677 21.1893 2.70652 20.08 1.98702C18.9707 1.26751 17.6609 0.915751 16.3383 0.982105C14.0202 1.06631 11.7739 1.80432 9.86133 3.11017C7.94879 4.41601 6.44884 6.23578 5.53645 8.35734C3.50384 13.133 1.54866 17.7353 0 21.837H2.43915C3.91038 17.9857 5.73004 13.6722 7.62714 9.24319C8.37138 7.52936 9.5842 6.05765 11.1276 4.99552C12.671 3.9334 14.4831 3.32351 16.3577 3.23511C17.2139 3.17428 18.0673 3.38587 18.7946 3.83935C19.5219 4.29282 20.0854 4.96469 20.4036 5.75773C20.7353 6.91643 20.7056 8.14804 20.3185 9.28961C19.9314 10.4312 19.205 11.4289 18.2355 12.151C16.2399 13.6743 13.7265 14.365 11.2278 14.0766C11.6014 13.7563 11.9568 13.4155 12.2925 13.056C13.2605 12.0095 14.0811 10.8369 14.7316 9.57052L12.9894 8.64623C12.3565 9.70839 11.5816 10.6801 10.6857 11.5347C9.81317 12.418 8.85332 13.2115 7.82073 13.9033L6.9109 14.481L7.4142 15.4246C8.70968 17.8298 10.7447 19.7597 13.2217 20.932C14.4419 21.5094 15.7504 21.8804 17.0933 22.0297C18.4955 22.2533 19.9324 22.1003 21.2553 21.5867L20.5972 19.7765C19.57 20.0639 18.4899 20.11 17.4418 19.9114Z" />
              </g>
            </svg>
          </a>
          <h3 className="text-center mb-4 lg:mt-2 px-2 leading-none text-black z-10 relative">
            All you need to know
            <span className="block md:inline"> when you have </span>
            <span className="block md:inline">something to throw</span>
          </h3>
          <SearchBar
            placeholderText={'Search for something'}
            searchType={[
              'items',
              'resources',
              'articles',
              'freecycling',
              'shops',
            ]}
            activeBackgroundColor="#F1EDEA"
            className="lg:w-[720px]"
            wrapperClassName="z-20"
            showBottomSpacing={false}
          />
        </div>
        <div className="container container--narrow relative z-10 lg:mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-2 lg:gap-x-4 gap-y-4 lg:gap-y-6 mt-6 lg:mt-12 home-items-grid">
            {items.map((item, key) => (
              <Card
                key={key}
                className="w-full"
                uniqueKey={`card-${key}`}
                content={{
                  image: item.images ? item.images[0] : {},
                  headerText: item.title,
                  slug: item.slug,
                  contentType: 'items',
                }}
              />
            ))}
          </div>
          <Link href="/items">
            <a className="btn">View all Items</a>
          </Link>
        </div>
        <div className="container ">
          <div className="lg:w-3/4 mx-auto my-12 md:mt-24 md:mb-20">
            <h3 className="text-2xl lg:text-[2rem] leading-tight font-medium text-center">
              Are you based in Singapore?{' '}
              <span className="block lg:inline">So are we.</span>
            </h3>
            <p className="mt-3 text-lg text-center">
              Our recommendations are based on local knowledge: recycling
              facilities, thrift shops, upcycling projects, popular apps, and
              more!
            </p>
          </div>
        </div>
        <div className="container lg:container--wide">
          <h2 className="mb-3 lg:mb-5">
            <Link href="/articles?section=Donation Drives" passHref>
              <a className="no-underline text-blue-light">
                <i className="far fa-hand-heart text-3xl mr-3" /> Donation
                Drives
              </a>
            </Link>
            <i className="fa fa-arrow-right font-light text-coral text-lg ml-3 group-hover:translate-x-1" />
          </h2>
          <div className="overflow-x-auto snap-x snap-mandatory">
            <div
              className="grid gap-x-2 grid-cols-4 lg:max-w-full"
              style={{ width: `${donationDrives.length * 100}vw` }}>
              {donationDrives.map((item, key) => {
                if (item !== null) {
                  return (
                    <Card
                      className={`w-[calc(75vw_-_8px)] ${
                        donationDrives.length - key === 1
                          ? 'snap-end'
                          : 'snap-start'
                      }`}
                      imagesWrapperClassName="aspect-[320_/_240]"
                      imgClassName=""
                      uniqueKey={`donation-drive-${item.slug}`}
                      content={{
                        image: item.coverImage || {},
                        headerText: item.title,
                        slug: item.slug,
                        contentType: 'articles',
                      }}
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div className="container container--wide mt-8 mb-6 lg:my-20">
          <div className="divide-y lg:divide-y-0 lg:divide-x divide-grey-light border-y-1 lg:border-y-0 border-grey-light lg:flex lg:flex-row">
            <motion.div
              initial="initial"
              whileInView="visible"
              viewport={{ once: true, amount: 'all', margin: '20%' }}
              variants={{
                initial: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              className="py-4 lg:px-6 lg:flex-1 lg:text-center group">
              <Link href="/resources" passHref>
                <a className="no-underline">
                  <h2>
                    <i className="far fa-recycle text-3xl mr-3 mt-1" />{' '}
                    Recycling++
                    <i className="fa fa-arrow-right font-light text-coral text-lg ml-3 group-hover:translate-x-1" />
                  </h2>
                  <h3 className="text-black group-hover:opacity-80">
                    There’s more than just blue bins. Find all the ways you can
                    keep your trash out of the incinerator.
                  </h3>
                </a>
              </Link>
            </motion.div>
            <motion.div
              initial="initial"
              whileInView="visible"
              viewport={{ once: true, amount: 'all', margin: '20%' }}
              variants={{
                initial: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              className="py-4 lg:px-6 lg:flex-1 lg:text-center group">
              <Link href="/freecycling" passHref>
                <a className="no-underline">
                  <h2>
                    <i className="far fa-box-heart text-3xl mr-3 mt-1" /> Where
                    to Freecycle
                    <i className="group-hover:translate-x-1 fa fa-arrow-right font-light text-coral text-lg ml-3" />
                  </h2>
                  <h3 className="text-black group-hover:opacity-80">
                    Donate, share, bless, giveaway. Extend the life of your
                    stuff by giving it to others.
                  </h3>
                </a>
              </Link>
            </motion.div>
            <motion.div
              initial="initial"
              whileInView="visible"
              viewport={{ once: true, amount: 'all', margin: '20%' }}
              variants={{
                initial: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
              }}
              className="py-4 lg:px-6 lg:flex-1 lg:text-center group">
              <Link href="/shops" passHref>
                <a className="no-underline">
                  <h2>
                    <i className="far fa-shopping-bag text-3xl mr-3 mt-1" />{' '}
                    Shop
                    <i className="fa fa-arrow-right font-light text-coral text-lg ml-3 group-hover:translate-x-1" />
                  </h2>
                  <h3 className="text-black group-hover:opacity-80">
                    Support businesses that are part of the circular solution.
                    Find pre-loved, upcycled, and zero waste goodies here.
                  </h3>
                </a>
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="container lg:container--wide">
          <h2 className="mb-3 lg:mb-5">
            <Link href="/articles" passHref>
              <a className="no-underline text-blue-light">
                <i className="far fa-lightbulb-exclamation text-3xl mr-3" />{' '}
                News & Views
              </a>
            </Link>
            <i className="fa fa-arrow-right font-light text-coral text-lg ml-3 group-hover:translate-x-1" />
          </h2>
          <div className="overflow-x-auto snap-x snap-mandatory">
            <div
              className="grid gap-x-2 grid-cols-4 lg:max-w-full"
              style={{ width: `${newsItems.length * 75}vw` }}>
              {newsItems.map((item, key) => {
                if (item !== null) {
                  return (
                    <Card
                      className={`w-[calc(75vw_-_8px)] ${
                        newsItems.length - key === 1 ? 'snap-end' : 'snap-start'
                      }`}
                      imagesWrapperClassName="aspect-[320_/_240]"
                      imgClassName=""
                      uniqueKey={`news-${item.slug}`}
                      content={{
                        image: item.coverImage || {},
                        headerText: item.title,
                        slug: item.slug,
                        contentType: 'articles',
                      }}
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div className="container ">
          <div className="my-12 md:my-24">
            <h2 className="leading-tight font-semibold text-center text-black">
              {newsletter.header}
            </h2>
            <div className="lg:w-3/4 mx-auto">
              <div
                className="mt-3 text-lg text-center"
                dangerouslySetInnerHTML={{ __html: newsletter.body }}></div>
              <Mailchimp />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const ip = process.env.API_URL;

  const { data: generalSettings } = await staticFetcher(
    `${ip}/general-setting?${qs.stringify({
      populate: [
        'homePageFeaturedArticles',
        'homePageFeaturedArticles.article.coverImage',
        'homePageFeaturedArticles.article.category',
        'homepageFeaturedDonationDrives',
        'homepageFeaturedDonationDrives.article.coverImage',
        'homepageFeaturedDonationDrives.article.category',
      ],
    })}`,
    process.env.API_KEY,
  );

  let newsItems =
    generalSettings.homePageFeaturedArticles.map(
      (article) => article.article,
    ) || [];

  let donationDrives =
    generalSettings.homepageFeaturedDonationDrives.map(
      (article) => article.article,
    ) || [];

  const { data: items } = await staticFetcher(
    `${ip}/items?${qs.stringify({
      sort: ['visits:desc', 'title'],
      populate: ['images'],
      pagination: {
        page: 1,
        pageSize: ITEMS_PER_PAGE,
      },
    })}`,
    process.env.API_KEY,
  );

  return {
    props: {
      items,
      newsItems,
      donationDrives,
      newsletter: {
        header: generalSettings.newsletterHeader,
        body: generalSettings.newsletterBodyText,
      },
    },
  };
}
