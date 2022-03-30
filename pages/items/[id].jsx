import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const { pid } = router.query;

  return <p>Post: {pid}</p>;
}
