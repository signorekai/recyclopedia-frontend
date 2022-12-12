/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_LOCATION,
  generateRobotsTxt: true, // (optional)
  exclude: ['/server-sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_LOCATION}/server-sitemap.xml`, // <==== Add here
    ],
  },
  // ...other options
};
