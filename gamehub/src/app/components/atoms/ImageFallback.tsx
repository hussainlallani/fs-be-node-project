import Image from "next/image";

interface ImageFallbackProps {
  src?: string;
  alt: string;
}

export default function ImageFallback({ src, alt }: ImageFallbackProps) {
  const fallback =
    "https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=";

  return (
    <Image
      src={src ?? fallback}
      alt={alt}
      width={400}
      height={192}
      className="w-full h-full object-cover rounded-t-lg"
      loading="lazy"
    />
  );
}
