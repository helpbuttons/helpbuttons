///image included in ButtonCard
///Btn is the project convention for tradittional buttons, in order to avoidd confussion with app's buttons
import React, { useState } from 'react';
import Image from 'next/image';
import { makeImageUrl } from 'shared/sys.helper';
import { audit } from 'rxjs';
import Loading from 'components/loading';

export enum ImageType {
  avatar,
  popup,
  marker,
  cardMap,
  cardList,
  buttonCard,
  avatarBig,
  avatarMed,
  preview,
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

  if (imageType == ImageType.avatar) {
    return (
      <HbImage
        style={{ objectFit: 'cover' }}
        src={makeImageUrl(src, '/api')}
        alt={alt}
        width={30}
        height={30}
      />
    );
  }
  if (imageType == ImageType.avatarBig) {
    return (
      <HbImage
        style={{ objectFit: 'cover' }}
        src={makeImageUrl(src, '/api')}
        alt={alt}
        width={68}
        height={68}
      />
    );
  }
  if (imageType == ImageType.avatarMed) {
    return (
      <HbImage
        style={{ objectFit: 'cover' }}
        src={makeImageUrl(src, '/api')}
        alt={alt}
        width={50}
        height={50}
      />
    );
  }
  if (imageType == ImageType.preview) {
    return (
      <HbImage
        style={{ objectFit: 'cover' }}
        src={makeImageUrl(src, '/api')}
        alt={alt}
        width={90}
        height={90}
      />
    );
  }
  if (imageType == ImageType.cardList) {
    return (
      <HbImage
        style={{ objectFit: 'cover', display: 'flex' }}
        src={makeImageUrl(src, '/api')}
        alt={alt}
        height={210}
        width={200}
      />
    );
  }
  if (imageType == ImageType.buttonCard) {
    return (
      <HbImage
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        src={makeImageUrl(src, '/api')}
        alt={alt}
        height={300}
        width={300}
      />
    );
  }
  return (
    <HbImage
      style={{ objectFit: 'cover' }}
      src={makeImageUrl(src, '/api')}
      alt={alt}
      fill={true}
    />
  );
}

export function HbImage(props) {
  const [loading, setLoading] = useState(true);
  const imageLoaded = () => {
    console.log('loaded...')
    setLoading(false);
  }
  return (<>
      <div style={{ display: loading ? 'block' : 'none' }}>
        <Loading/>
      </div>
      <Image
        {...props}
        onLoadingComplete={(img) => {setLoading(false) }} 
      />
    </>
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
    <HbImage
      src={makeImageUrl(src, '/api')}
      alt={alt}
      width={width}
      height={height}
    />
  );
}
