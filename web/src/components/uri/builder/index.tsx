import { useState } from "react";
import { useRouter } from 'next/router';

export function replaceUrl(url) {
  window.history.replaceState(null, '', url);
}

export function updateUrl(router, queryParams = null) {
  if (queryParams === null) {
    router.push(
      {
      },
      undefined,
      { shallow: true }
    );
  } else {
    router.push(
      {
        query: queryParams,
      },
      undefined,
      { shallow: true }
    );
  }

}



export function usePreviousUrl() {
  const router = useRouter();
  const [previousUrl, setPreviousUrl] = useState(null);

  const handleRouteChange = (url) => {
    setPreviousUrl(router.asPath);
  };

  router.events.on('routeChangeComplete', handleRouteChange);

  return previousUrl;
}