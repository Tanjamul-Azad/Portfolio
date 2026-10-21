"use client";

import NextImage, { type ImageLoaderProps, type ImageProps } from "next/image";
import { getImageAsset, getImageUrl } from "@/lib/image-assets";

function staticLoader({ src, width }: ImageLoaderProps) {
  return getImageUrl(src, width);
}

/** Responsive, pre-generated media with Next's layout and loading semantics. */
export default function SiteImage(props: ImageProps) {
  const asset = typeof props.src === "string" ? getImageAsset(props.src) : undefined;
  if (!asset || props.loader || props.unoptimized) return <NextImage {...props} />;
  return <NextImage {...props}
    loader={staticLoader}
    width={props.fill ? undefined : props.width || asset.width}
    height={props.fill ? undefined : props.height || asset.height}
    placeholder={props.placeholder || "blur"}
    blurDataURL={props.blurDataURL || asset.blurDataURL}
  />;
}
