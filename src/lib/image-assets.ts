import manifest from "@/generated/image-manifest.json";

interface ImageAsset {
  width: number;
  height: number;
  blurDataURL: string;
  variants: { width: number; src: string; bytes: number }[];
}
const assets = manifest as Record<string, ImageAsset>;

export function getImageAsset(src: string) {
  return assets[src];
}

export function getImageUrl(src: string, width: number) {
  const variants = getImageAsset(src)?.variants;
  return variants ? (variants.find(variant => variant.width >= width) || variants[variants.length - 1]).src : src;
}
