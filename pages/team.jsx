import Head from 'next/head';
import Layout from '../components/Layout';
import React from 'react';
import { getOpengraphTags } from '../components/OpenGraph';
import { staticFetcher, useWindowDimensions } from '../lib/hooks';
import { addMissingTitleToImg, replaceCDNUri } from '../lib/functions';
import Image from '../components/Image';

export default function Page({ pageOptions }) {
  const { title, SEO, bodyText, members } = pageOptions;
  const { isDesktop } = useWindowDimensions();
  const meta = getOpengraphTags({ title }, SEO);

  return (
    <Layout title={title}>
      <Head>
        <meta
          name="og:title"
          key="og:title"
          content={`${meta.title} | Recyclopedia.sg`}
        />
        {meta.description && meta.description.length > 0 && (
          <>
            <meta
              key="description"
              name="description"
              content={meta.description}
            />
            <meta
              property="og:description"
              key="og:description"
              content={meta.description}
            />
          </>
        )}
        <meta property="og:image" key="og:image" content={meta.image} />
      </Head>
      <div className="bg-teal">
        <div className="container py-6 lg:py-14">
          <h1 className="text-black">{title}</h1>
        </div>
      </div>
      <div className="container">
        {members.map((member, key) => {
          return (
            <div key={`team-member-${key}`}>
              <div className="flex flex-row items-center pt-6 gap-x-6">
                {member.profilePhoto && (
                  <Image
                    className="bg-grey-light rounded-full"
                    alt={`Photo of ${member.name}`}
                    width={isDesktop ? 96 : 80}
                    height={isDesktop ? 96 : 80}
                    layout="fixed"
                    placeholder={member.profilePhoto.placeholder}
                    source={member.profilePhoto}></Image>
                )}
                <div>
                  <h2 className="text-black justify-start mb-0">
                    {member.name}
                  </h2>
                  <span>{member.jobTitle}</span>
                </div>
              </div>
              <div
                className="user-editable pt-6"
                dangerouslySetInnerHTML={{
                  __html: addMissingTitleToImg(replaceCDNUri(member.biography)),
                }}></div>
              <div
                className={`team-member-links pt-6 ${
                  member.buttons.length === 0 && 'lg:pb-4'
                }`}>
                {member.links.map((link, linkKey) => {
                  return (
                    <span
                      key={`team-member-${key}-link-${linkKey}`}
                      className="team-member-link">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer">
                        {link.label}
                      </a>
                    </span>
                  );
                })}
              </div>
              {member.buttons.length > 0 && (
                <div className="mt-8 lg:pb-4">
                  {member.buttons.map((button, btnKey) => {
                    return (
                      <a
                        key={`team-member-${key}-button-${btnKey}`}
                        className="bg-coral text-white px-5 py-2 rounded-md text-lg font-semibold hover:bg-coral-dark transition-all hover:text-white no-underline block text-center md:inline-block"
                        href={button.url}
                        target="_blank"
                        rel="noopener noreferrer">
                        {button.label}
                      </a>
                    );
                  })}
                </div>
              )}
              <div className="divider-b mt-6 mb-4"></div>
            </div>
          );
        })}
        <h2 className="text-black justify-start pb-0 mb-0 pt-6">
          Join our team
        </h2>
        <div
          className="pt-6 user-editable pb-10 lg:pb-20"
          dangerouslySetInnerHTML={{
            __html: addMissingTitleToImg(replaceCDNUri(bodyText)),
          }}></div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { data: pageOptions } = await staticFetcher(
    `${process.env.API_URL}/team-page`,
    process.env.API_KEY,
    {
      populate: [
        'SEO',
        'SEO.image',
        'members',
        'members.profilePhoto',
        'members.links',
        'members.buttons',
      ],
    },
  );

  return { props: { pageOptions } };
}
