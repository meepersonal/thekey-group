import { useState } from "react";
import { ImageOff } from "lucide-react";
import { resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

type ImageWithFallbackProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  /** Classes du conteneur qui remplace l'image (ratio, fond, taille). */
  wrapperClassName?: string;
  /** Classes appliquées à la balise `img`. */
  className?: string;
  fallbackLabel?: string;
};

/**
 * Affiche une image avec trois états gérés à la place : squelette au chargement,
 * image si elle répond, placeholder sinon (source vide **ou** URL cassée).
 * Les sources passent par `resolveImageUrl`, donc les chemins relatifs du backend
 * restent valables quand l'API est sur un autre hôte.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  wrapperClassName,
  fallbackLabel = "Aucune image disponible",
  loading = "lazy",
  width,
  height,
  ...rest
}: ImageWithFallbackProps) {
  const url = resolveImageUrl(src);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!url || failed) {
    return (
      <div
        className={cn(
          "grid h-full w-full place-items-center bg-secondary text-muted-foreground",
          wrapperClassName ?? className,
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-8 w-8" />
        <span className="sr-only">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div aria-hidden="true" className={cn("absolute inset-0 animate-pulse bg-secondary")} />
      )}
      <img
        src={url}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        {...(width !== undefined ? { width } : {})}
        {...(height !== undefined ? { height } : {})}
        {...rest}
        className={className}
      />
    </>
  );
}
