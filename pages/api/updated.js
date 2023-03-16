export default async function handler(req, res) {
  const { event, model, entry } = req.body;

  console.log(model, event, entry);

  if (
    req.headers.authorization !== `Bearer ${process.env.CONTENT_UPDATE_KEY}`
  ) {
    return res.status(401).send('Error');
  }

  if (!event || !model || !entry) {
    return res.status(401).send('Error');
  }

  let url = [];

  switch (model) {
    case 'general-setting':
      url.push('/');
      break;

    case 'home-page':
      url.push('/');
      break;

    case 'article':
      url.push('/');
      url.push('/articles');
      url.push(`/${model}s/${entry.slug}`);
      break;

    case 'item':
      url.push('/');
      url.push(`/items`);
      url.push(`/${model}s/${entry.slug}`);
      break;

    case 'resource':
      url.push('/freecycling', '/resources', '/shops');
      url.push(`/freecycling/${entry.slug}`);
      url.push(`/resources/${entry.slug}`);
      url.push(`/shops/${entry.slug}`);
      break;

    case 'article-category':
      url.push('/articles');
      var items = entry.articles.map((article) => `/articles/${article.slug}`);
      url = url.concat(items);
      break;

    case 'item-category':
      url.push('/items');
      var items = entry.items.map((item) => `/items/${item.slug}`);
      url = url.concat(items);
      break;

    case 'resource-tag':
      url.push('/freecycling', '/resources', '/shops');

      var items = entry.resources.map(
        (resource) => `/resources/${resource.slug}`,
      );
      url = url.concat(items);
      break;

    case 'contact-us-page':
      url.push('/feedback');
      break;

    case 'about-us-page':
      url.push('/about-us');
      break;

    case 'donate-page':
      url.push('/freecycling');
      break;

    case 'faq':
      url.push('/faq');
      break;

    case 'items-page':
      url.push('/items');
      break;

    case 'newsletter-page':
      url.push('/newsletter');
      break;

    case 'news-and-tips-page':
      url.push('/articles');
      break;

    case 'resource-page':
      url.push('/resources');
      break;

    case 'shops-page':
      url.push('/shops');
      break;

    case 'terms-of-service':
      url.push('/terms-of-service');
      break;

    case 'privacy-policy':
      url.push('/privacy-policy');
      break;
  }

  console.table(url);

  try {
    for (let index = 0; index < url.length; index++) {
      console.log(`trying ${url[index]}`);
      await res.revalidate(url[index]);
      console.log('success', url[index]);
    }
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
