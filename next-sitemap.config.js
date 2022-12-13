/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_LOCATION,
  generateRobotsTxt: true, // (optional)
  generateIndexSitemap: false,
  exclude: ['/sitemap.xml'], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_LOCATION}/sitemap.xml`, // <==== Add here
    ],
  },
  // ...other options
};
