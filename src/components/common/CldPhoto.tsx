import Image, { type ImageProps } from "next/image";
import { CldImage, type CldImageProps } from "next-cloudinary";
import { extractPublicId } from "@/lib/cloudinary";

type CldPhotoProps = CldImageProps;

/**
 * Local assets (/images/...) render via next/image. Everything else is
 * assumed to be a Cloudinary delivery URL built by cloudinaryImage() and
 * renders via CldImage, which builds a properly sized/format-negotiated
 * transform URL instead of shipping the full-resolution original.
 *
 * crop/gravity are intentionally NOT defaulted here: pass crop="fill"
 * gravity="auto" for thumbnails, but omit both for full-photo views (e.g.
 * the lightbox) so Cloudinary only resizes and never crops the source.
 */
export default function CldPhoto({ src, quality = "auto", crop, gravity, ...rest }: CldPhotoProps) {
  if (src.startsWith("/") || src.startsWith("data:")) {
    return (
      <Image
        src={src}
        quality={typeof quality === "number" ? quality : undefined}
        {...(rest as Omit<ImageProps, "src" | "quality">)}
      />
    );
  }

  return (
    <CldImage
      src={extractPublicId(src)}
      format="auto"
      quality={quality}
      crop={crop}
      gravity={gravity}
      {...rest}
    />
  );
}
