import React from 'react';
import Head from 'next/head';

export default props => {
  const { keyword = '关键词1,关键词2', description = '描述' } = props;
  return (
    <Head>
      <link rel="icon" href="/favicon.png" type="image/x-icon" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="keyword" content={keyword} />
      <meta name="description" content={description} />
    </Head>
  );
};
