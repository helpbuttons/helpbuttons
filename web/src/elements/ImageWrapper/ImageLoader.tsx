"use client";

import Image from "next/image";
import { useState } from "react";

export const ImageLoader = ({ src, alt, ...props }) => {
  const [reveal, setReveal] = useState(false);
  const visibility = reveal ? "visible" : "hidden";
  const loader = reveal ? "none" : "block";

  return (
    <>
    {/* <div className="loading__img" style={{ display: loader }} ></div> */}
      <Image
        src={src}
        alt={alt}
        width={props.width}
        height={props.height}
        {...props}
        style={{ ...props.style, visibility }}
        onError={() => setReveal(true)}
        onLoadingComplete={() => setReveal(true)}
      />
    </>
  );
};