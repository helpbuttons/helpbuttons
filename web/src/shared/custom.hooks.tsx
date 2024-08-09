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