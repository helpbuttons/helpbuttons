"use client";

import Loading from "components/loading";
import Image from "next/image";
import { useState } from "react";

const NO_IMAGE = "/assets/svg/logo/no-image.svg";

export const ImageLoader = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [reveal, setReveal] = useState(false);
  const visibility = reveal ? "visible" : "hidden";

  return (
    <>
    {visibility == 'hidden' && <Loading/>}
    <Image
      src={imgSrc}
      alt={alt}
      width={props.width}
      height={props.height}
      {...props}
      style={{ ...props.style, visibility }}
      onError={() => { setImgSrc(NO_IMAGE); setReveal(() => true); }}
      onLoad={() => setReveal(() => true)}
    />
    </>
  );
};