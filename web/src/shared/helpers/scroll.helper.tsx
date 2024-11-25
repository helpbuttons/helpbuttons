import Loading from "components/loading";
import { useEffect, useRef, useState } from "react";

export function useScroll(onLoadMore) {
  const [noMoreToLoad, setNoMoreToLoad] = useState(false)
  const [scrollIsLoading, setScrollIsLoading] = useState(false)

  const callbackFunction = (entries) => {
    if (scrollIsLoading) {
      return;
    }
    if(noMoreToLoad)
    {
      return;
    }
    const [entry] = entries;

    if (entry.isIntersecting) {
      onLoadMore(
        {
          setScrollIsLoading: setScrollIsLoading,
          setNoMoreToLoad: setNoMoreToLoad,
        });
    }
  };
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  };

  const listEndRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      callbackFunction,
      options,
    );
    if (listEndRef.current) observer.observe(listEndRef.current);

    return () => {
      if (listEndRef.current) observer.unobserve(listEndRef.current);
    };
  }, [listEndRef, options]);

  const endDivLoadMoreTrigger = <>
    {!noMoreToLoad && (
      <div ref={listEndRef}>
        {scrollIsLoading && <Loading />}
      </div>
    )}
    <br />
    <br />
    <br />
    <br />
  </>
  return { noMoreToLoad, endDivLoadMoreTrigger };
}