//popup for extra filters when they don't fit in the filter section under the header. It uses popup classes and overllays to all site.

import Head from 'next/head';

export default function SEO({title, description, image, pageurl, siteTitle}) {
 return (
          <Head>
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* <!-- Schema.org markup for Google+ --> */}
            <meta itemProp="name" content={title} />
            <meta itemProp="description" content={description} />
            <meta itemProp="image" content={image} />

            {/* <!-- Twitter Card data --> */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta
              name="twitter:description"
              content={description}
            />
            {/* <!-- Twitter summary card with large image must be at least 280x150px --> */}
            <meta name="twitter:image:src" content={image} />

            {/* <!-- Open Graph data --> */}
            <meta property="og:title" content={title} />
            <meta property="og:url" content={pageurl} />
            <meta property="og:image" content={image} />
            <meta
              property="og:description"
              content={description}
            />
            <meta property="og:site_name" content={siteTitle} />
          </Head>
  );
}
