///image included in ButtonCard
///Btn is the project convention for tradittional buttons, in order to avoidd confussion with app's buttons
import React from "react";
import Image from 'next/image'
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export enum ImageType {
    avatar,
    popup,
    marker,
    cardMap,
    cardList,
    buttonCard,
}

export enum ContentAlignment {
    left,
    center,
    right,
}

interface ImageProps {
    height?: string;
    width?: string;
    layout?: string;
    src: string;
    alt: string;
    objectFit?: string;
    imageType: ImageType;
    localUrl?: boolean;
}


export default function ImageWrapper({
    height = "200",
    width = "200",
    alt = null,
    layout = "responsive",
    src = null,
    objectFit = "contain",
    imageType = ImageType.popup,
    localUrl = false
}: ImageProps) {
    let classNames = [];

    switch (imageType) {
        case ImageType.popup:
            width = "200";
            height = "80";
            break;
        case ImageType.marker:
            break;
        case ImageType.cardMap:
            layout = "responsive";
            width = "200";
            height = "130";
            break;
        case ImageType.cardList:
            layout = "responsive";
            width = "1000";
            height = "1000";
            break;
        case ImageType.buttonCard:
            width = "1000";
            height = "1000";
            layout = "responsive";
            break;
        default:
            break;
    }

    const className = classNames.join(" ");
    if (localUrl && src) {
        src = baseUrl + "/files/get/" + src;
    } else {
        const seed = "x" + alt.slice(0, 20).replace(" ", "").replace("'", "");
        src = `https://picsum.photos/seed/${seed}/${width}/${height}`;
    }

    return (
          <Image
            src={src}
            alt={alt}
            layout={layout}
            width={width}
            height={height}
          />
    );
}

export function ImageContainer({
    height = 200,
    width = 200,
    alt = null,
    src = '',
    localUrl = false
}) {
    let classNames = [];

    const className = classNames.join(" ");
    if (!src) {
        return (
            <>
            </>
        );
    }
    if (localUrl) {
        src = baseUrl + "/files/get/" + src;
    }
    return (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
          />
    );
}
