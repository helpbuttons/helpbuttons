import { useState } from 'react';

export const useScrollHeight = (size) => {
  let [sliceSize, setSliceSize] = useState(5);

  const handleScrollHeight = (e) => {
    const edgeHeight =
      e.target.scrollHeight - e.target.scrollTop ===
      e.target.clientHeight;
    if (edgeHeight) {
      setSliceSize((prevValue) => {
        const newValue = prevValue + 2;
        if (newValue <= size) return newValue;
        return prevValue;
      });
    }
  };
  return { sliceSize, handleScrollHeight };
};

export const useScrollHeightAndWidth = (size) => {
  let [sliceSize, setSliceSize] = useState(6);

  const handleScrollHeight = (e) => {
    const edgeHeight =
      e.target.scrollHeight - e.target.scrollTop ===
      e.target.clientHeight;
    if (edgeHeight) {
      setSliceSize((prevValue) => {
        const newValue = prevValue + 2;
        if (newValue <= size) return newValue;
        return prevValue;
      });
    }
  };

  const handleScrollWidth = (e) => {
    const edge =
      e.target.scrollWidth - e.target.scrollLeft ===
      e.target.clientWidth;
    if (edge) {
      setSliceSize((prevValue) => {
        const newValue = prevValue + 2;
        if (newValue <= size) return newValue;
        return prevValue;
      });
    }
  };

  return { sliceSize, handleScrollHeight, handleScrollWidth };
};
