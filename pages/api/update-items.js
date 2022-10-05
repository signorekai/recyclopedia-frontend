import qs from 'qs';

export default async function handler(req, res) {
  // const { data: settings } = await staticFetcher(
  //   `${process.env.API_URL}/general-setting?${qs.stringify({
  //     populate: ['footerSocialIcons'],
  //   })}`,
  //   process.env.API_KEY,
  // );

  // res.json({ data: settings });
  const filterEntries = (data) =>
    data.filter((item) => {
      const itemRecommendations = item.recommendations.filter(
        (recco) =>
          recco.resources.length > 0 && recco.resourcesComp.length === 0,
      );
      if (itemRecommendations.length > 0) {
        return true;
      }
      return false;
    });

  const compileUpdate = (data) =>
    data.map((item) => ({
      title: item.title,
      recommendations: item.recommendations.map((recco) => {
        const copyOfRecco = { ...recco };
        delete copyOfRecco.resources;
        delete copyOfRecco.id;

        return {
          ...copyOfRecco,
          resources: recco.resources.map((resource) => resource.id),
          resourcesComp: recco.resources.map((resource) => ({
            resource: resource.id,
          })),
        };
      }),
    }));

  const results = await fetch(
    `${process.env.API_URL}/items/?${qs.stringify({
      fields: ['id', 'title'],
      populate: ['recommendations.resources', 'recommendations.resourcesComp'],
      pagination: {
        pageSize: 1000,
      },
    })}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );
  const { data } = await results.json();
  const filteredData = filterEntries(data);
  const updates = compileUpdate(filteredData);
  const updated = [];

  if (
    updates.every((update, index) => {
      return update.title === filteredData[index].title;
    })
  ) {
    updates.forEach(async (update, index) => {
      const results = await fetch(
        `${process.env.API_URL}/items/${filteredData[index].id}`,
        {
          body: JSON.stringify({ data: update }),
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        },
      );

      const response = await results.json();
      updated.push(response);
    });
  }

  res.json({ updated });
}
