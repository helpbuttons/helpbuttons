//popup for extra filters when they don't fit in the filter section under the header. It uses popup classes and overllays to all site.

import Head from 'next/head';
import { GlobalState } from 'state';
import { useEffect, useState } from 'react';
import { useGlobalStore } from 'state';

export default function MetadataSEOFromStore({nonce}) {
  const metadataStore = useGlobalStore(
    (state: GlobalState) => state.metadata,
  );

  return (
    <MetadataSEO {...metadataStore} nonce={nonce} />
  );
}
export function MetadataSEO(props) {

  const {
    title,
    description,
    image,
    pageurl,
    siteTitle,
    color,
    nonce,
    webUrl
  } =  props;

  const csp = `object-src 'none'; base-uri 'none'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http: 'nonce-${nonce}' 'strict-dynamic'`

  return (
      // <Head nonce={nonce}>
        <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {/* <meta httpEquiv="Content-Security-Policy" content={csp} /> */}
        {/* <!-- Schema.org markup for Google+ --> */}
        <meta itemProp="name" content={title} />
        <meta itemProp="description" content={description} />
        <meta itemProp="image" content={image} />

        {/* <!-- Twitter Card data --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {/* <!-- Twitter summary card with large image must be at least 280x150px --> */}
        <meta name="twitter:image:src" content={image} />

        {/* <!-- Open Graph data --> */}
        <meta property="og:title" content={title} />
        <meta property="og:url" content={pageurl} />
        <meta property="og:image" content={image} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={siteTitle} />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${webUrl}/api/networks/logo/32`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${webUrl}/api/networks/logo/16`}
        />
        <link rel="manifest" href={`${webUrl}/manifest.json`} />
        <link
          rel="mask-icon"
          href={`${webUrl}api/networks/logo/32`}
          color={color}
        />
        <meta name="msapplication-TileColor" content={color} />
        <meta name="theme-color" content={color} />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${webUrl}/api/networks/logo/180`}
        />
      </Head>

  );
}
