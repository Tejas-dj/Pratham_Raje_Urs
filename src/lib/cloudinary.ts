const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function cloudinaryImage(
  publicId: string,
  opts: { width?: number; quality?: string; format?: string } = {},
): string {
  const transforms = [
    opts.format ? `f_${opts.format}` : "f_auto",
    opts.quality ? `q_${opts.quality}` : "q_auto",
    opts.width ? `w_${opts.width}` : "",
  ]
    .filter(Boolean)
    .join(",");

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
}

/**
 * cloudinaryImage() builds delivery URLs without a /v<version>/ segment, which
 * @cloudinary-util's URL parser requires. CldImage's `src` still accepts a bare
 * public ID, so pull it out with a plain regex instead of relying on that parser.
 */
export function extractPublicId(cloudinarySrc: string): string {
  const match = cloudinarySrc.match(/\/upload\/[^/]+\/(.+)$/);
  return match ? match[1] : cloudinarySrc;
}

export function cloudinaryVideo(
  publicId: string,
  opts: { quality?: string; format?: string } = {},
): string {
  const transforms = [
    opts.quality ? `q_${opts.quality}` : "q_auto",
    opts.format ? `f_${opts.format}` : "",
  ]
    .filter(Boolean)
    .join(",");

  const transformPart = transforms ? `${transforms}/` : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${transformPart}${publicId}`;
}
