import { useEffect, useRef, useState } from "react";

export function useScroll(onLoadMore) {
    const [isVisible, setIsVisible] = useState(false);
    const callbackFunction = (entries) => {
      const [entry] = entries;
      setIsVisible(() => entry.isIntersecting);
  
      if (isVisible) {
        onLoadMore();
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
  
    return { listEndRef };
  }