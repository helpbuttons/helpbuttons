import { Router } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

export function usePrevious(value) {

  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export const useToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = useState(initialState);
  
  // Define and memorize toggler function in case we pass down the component,
  // This function change the boolean value to it's opposite value
  const toggle = useCallback((value) => typeof value === "boolean" ? setState(state => value) : setState(state => !state), []);
  
  return [state, toggle] as const
}


export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay]
  );

  return debouncedValue;
}

type UseIntervalOptions = {
  immediate: boolean
  paused: boolean
}

/**
 * Run a function repeatedly at a specified interval.
 *
 * @see https://react-hooks-library.vercel.app/core/useInterval
 */
export function useInterval<T extends () => void>(
  callback: T,
  delay: number,
  options?: Partial<UseIntervalOptions>
) {
  const { immediate = false, paused = false } = options || {}
  const savedCallback = useRef(callback)
  const tickId = useRef<NodeJS.Timer>()

  useEffect(() => {
    savedCallback.current = callback

    if (!paused && immediate) {
      callback()
    }
  }, [callback, immediate, paused])

  useEffect(() => {
    if (tickId.current && paused) {
      clearInterval(tickId.current)
      return
    }

    tickId.current = setInterval(() => savedCallback.current(), delay)

    return () => tickId.current && clearInterval(tickId.current)
  }, [delay, paused])
}

export const useBackButton = (callback) => {
  const handleBackButton = useCallback(callback, [callback]);

  useEffect(() => {
    window.addEventListener('popstate', handleBackButton);
    
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [handleBackButton]);
};

export default function useComponentVisible(initialIsVisible) {
  const [showSubmenu, setShowSubmenu] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowSubmenu(false);
      }
  };

  useEffect(() => {
      document.addEventListener('click', handleClickOutside, true);
      return () => {
          document.removeEventListener('click', handleClickOutside, true);
      };
  }, []);

  return { ref, showSubmenu, setShowSubmenu };
}
export const useShowPopup = () => {
  const [popupShowState, setPopupState] =  useState(false)

  const closePopup = () => setPopupState(() => false)
  const openPopup = () => setPopupState(() => true)

  return [popupShowState,openPopup, closePopup]
}

export const usePoolFunc = ({paused, timeMs, func }) => {
  const increment = useCallback(() => {
    func()
  }, []);
  useInterval(increment, timeMs, { paused: paused });
};

export const useScrollDirection = (ref) => {

  const lastScrollTopRef = useRef<number>(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);

  // Detect scroll direction
  useEffect(() => {
    
    if (!ref?.current) return;
    const refContent = ref.current;
    const handleScroll = () => {
      const currentScrollTop = refContent.scrollTop;
      const scrollHeight = refContent.scrollHeight;
      const clientHeight = refContent.clientHeight;
      
      if (currentScrollTop <= 0) {
        return; 
      }
      
      if (currentScrollTop + clientHeight >= scrollHeight) {
        return; 
      }
      
      const _isScrollingUp = currentScrollTop < lastScrollTopRef.current;
      setIsScrollingUp(() => _isScrollingUp);
      
      lastScrollTopRef.current = currentScrollTop;
    };

    refContent.addEventListener('scroll', handleScroll);

    return () => {
      refContent.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isScrollingUp
}


export const useWarnIfUnsavedChanges = (unsavedChanges: boolean, callback: () => boolean) => {
  useEffect(() => {
    if (unsavedChanges) {
      const routeChangeStart = () => {
        const ok = callback()
        if (!ok) {
          Router.events.emit("routeChangeError")
          throw "Abort route change. Please ignore this error."
        }
      }
      Router.events.on("routeChangeStart", routeChangeStart)

      const beforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        return false;
      }
      window.addEventListener('beforeunload', beforeUnload);

      return () => {
        window.removeEventListener('beforeunload', beforeUnload);
        Router.events.off("routeChangeStart", routeChangeStart)
      }
    }
  }, [unsavedChanges])
}

export const useOnPageExit = (onPageExit) => {
  useEffect(() => {
    const routeChangeStart = () => {
      onPageExit()
    }
    Router.events.on("routeChangeStart", routeChangeStart)
  
    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return false;
    }
    window.addEventListener('beforeunload', beforeUnload);
  
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      Router.events.off("routeChangeStart", routeChangeStart)
    }
  }, [])
}
