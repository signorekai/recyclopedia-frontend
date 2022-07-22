export default async function handler(req, res) {
  const { event, model, entry } = req.body;

  console.log(model);

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
    case 'article':
      url.push('/');
      url.push('/news-tips');
      url.push(`/${model}s/${entry.slug}`);
      break;

    case 'item':
      url.push('/');
      url.push(`/items`);
      url.push(`/${model}s/${entry.slug}`);
      break;

    case 'resource':
      url.push('/donate', '/resources', '/shops');
      url.push(`/${model}s/${entry.slug}`);
      break;

    case 'article-category':
      url.push('/news-tips');
      var items = entry.articles.map((article) => `/articles/${article.slug}`);
      url = url.concat(items);
      break;

    case 'item-category':
      url.push('/items');
      var items = entry.items.map((item) => `/items/${item.slug}`);
      url = url.concat(items);
      break;

    case 'resource-tag':
      url.push('/donate', '/resources', '/shops');

      var items = entry.resources.map(
        (resource) => `/resources/${resource.slug}`,
      );
      url = url.concat(items);
      break;

    case 'about-us-page':
      url.push('/about-us');
      break;

    case 'donate-page':
      url.push('/donate');
      break;

    case 'faq':
      url.push('/faq');
      break;

    case 'items-page':
      url.push('/items');
      break;

    case 'news-and-tips-page':
      url.push('/news-tips');
      break;

    case 'resource-page':
      url.push('/resources');
      break;

    case 'shops-page':
      url.push('/shops');
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
