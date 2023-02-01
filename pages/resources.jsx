import ListingPage, { getListingStaticProps } from '../components/Listing';

export default function Page(props) {
  return <ListingPage {...props} />;
}

export async function getStaticProps() {
  const props = await getListingStaticProps({
    contentUrl: 'resource-page',
  });

  return {
    props: {
      ...props,
      contentType: 'resources',
    },
  };
}
