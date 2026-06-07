import Image from "next/image";
import { aboutImage } from "@/lib/about-tw";

type Props = {
  src: string;
  alt: string;
  /** Sizing and positioning on the outer wrapper */
  className?: string;
  /** Frame shape, overlays, and image filters on the inner wrapper */
  frameClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export function AboutImage({
  src,
  alt,
  className = "",
  frameClassName = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 560px"
}: Props) {
  return (
    <div className={className}>
      <div
        className={`relative size-full overflow-hidden rounded-[20px] bg-about-border ${frameClassName}`.trim()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={aboutImage}
          sizes={sizes}
          quality={90}
          priority={priority}
        />
      </div>
    </div>
  );
}
