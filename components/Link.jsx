import NextLink from 'next/link';

const Link = ({ children, ...props }) => {
  return (
    <NextLink prefetch={false} {...props}>
      {children}
    </NextLink>
  );
};

export default Link;
