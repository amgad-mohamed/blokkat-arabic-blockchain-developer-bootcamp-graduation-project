import React from 'react';
import Poll from '@/components/Poll';

// Dynamically import the Poll component with SSR disabled

const Page = async ({ params }: { params: { id: string } }) => {
  const pollId = params.id;

  return <Poll pollId={pollId} />;
};

export default Page;
