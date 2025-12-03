import Loading from "components/loading";
import { useEffect, useRef, useState } from "react";

export function useScroll(onLoadMore, watchThis = null) {
  const [noMoreToLoad, setNoMoreToLoad] = useState(false)
  const [scrollIsLoading, setScrollIsLoading] = useState(false)

  useEffect(() => {
    if(watchThis)
    {
      setNoMoreToLoad(() => false)
    }
  }, [watchThis])

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
  return { noMoreToLoad, endDivLoadMoreTrigger, scrollIsLoading };
}

export function useFocusOn(focusId, id) {
  const ref = useRef( null );
  const [focus, setFocus] = useState(false)
  useEffect(() => {
    if(focusId == id){
      setFocus(() => true)
    }else{
      setFocus(() => false)
    }
  }, [focusId])

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [focus]); 

  return {ref, focus}
}