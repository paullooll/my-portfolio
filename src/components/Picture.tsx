/** <picture> with a WebP source next to the original PNG (made by `pnpm assets`). */
export function Picture({
  src,
  alt,
  width,
  height,
  className,
  eager = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  eager?: boolean;
}) {
  const webp = encodeURI(src.replace(/\.png$/, ".webp"));
  return (
    <picture>
      <source srcSet={webp} type="image/webp" />
      <img
        src={encodeURI(src)}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={eager ? "high" : undefined}
      />
    </picture>
  );
}
