///image included in ButtonCard
///Btn is the project convention for tradittional buttons, in order to avoidd confussion with app's buttons
import React from 'react';
import Image from 'next/image'
import { makeImageUrl } from 'shared/sys.helper';
import { audit } from 'rxjs';

export enum ImageType {
  avatar,
  popup,
  marker,
  cardMap,
  cardList,
  buttonCard,
  avatarBig,
  avatarMed,
  preview
}

export enum ContentAlignment {
  left,
  center,
  right,
}

interface ImageProps {
  height?: number;
  width?: number;
  layout?: string;
  src: string;
  alt: string;
  objectFit?: string;
  imageType: ImageType;
  localUrl?: boolean;
}

export default function ImageWrapper({
  height = 200,
  width = 200,
  alt = null,
  layout = 'responsive',
  src = null,
  objectFit = 'contain',
  imageType = ImageType.popup,
  localUrl = false,
}: ImageProps) {
  let classNames = [];

  const className = classNames.join(' ');

  if(imageType == ImageType.avatar) 
  {
    return (
      <Image
      src={makeImageUrl(src, '/api')}
      alt={alt}
      width={30}
      height={30}
    />
    )
  }
  if(imageType == ImageType.avatarBig) 
  {
    return (
      <Image
      src={makeImageUrl(src, '/api')}
      alt={alt}
      width={68}
      height={68}
    />
    )
  }
  if(imageType == ImageType.avatarMed) 
  {
    return (
      <Image
      src={makeImageUrl(src, '/api')}
      alt={alt}
      width={50}
      height={50}
    />
    )
  }
  if(imageType == ImageType.preview) 
  {
    return (
      <Image
      src={makeImageUrl(src, '/api')}
      alt={alt}
      width={90}
      height={90}
    />
    )
  }
  // if(imageType == ImageType.buttonCard) 
  // {
  //   return (
  //     <Image
  //     src={makeImageUrl(src, '/api')}
  //     alt={alt}
  //     height={auto}
  //     width={1000}
  //   />
  //   )
  // }
  return (
    <Image
      src={makeImageUrl(src, '/api')}
      alt={alt}
      fill={true}
    />
  );
}

export function ImageContainer({
  height = 200,
  width = 200,
  alt = null,
  src = '',
  localUrl = false,
}) {
  let classNames = [];

  const className = classNames.join(' ');
  
  return (
    <Image src={makeImageUrl(src, '/api')} alt={alt} width={width} height={height} />
  );
}
