import { useEffect, useState } from "react";
import mark from "@/assets/logo-png.jpg";
import fullLogo from "@/assets/full-logo-png.jpg";

function useTransparentImage(source: string) {
  const [transparentImage, setTransparentImage] = useState<string>();

  useEffect(() => {
    const image = new Image();
    image.src = source;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d");
      if (!context) return;

      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      for (let index = 0; index < pixels.data.length; index += 4) {
        const red = pixels.data[index] ?? 0;
        const green = pixels.data[index + 1] ?? 0;
        const blue = pixels.data[index + 2] ?? 0;
        const brightness = Math.max(red, green, blue);
        const saturation = brightness - Math.min(red, green, blue);
        if (saturation < 28 && brightness > 85) pixels.data[index + 3] = 0;
      }
      context.putImageData(pixels, 0, 0);
      setTransparentImage(canvas.toDataURL("image/png"));
    };
  }, [source]);

  return transparentImage;
}

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  const transparentMark = useTransparentImage(mark);
  return (
    <img
      src={transparentMark ?? mark}
      alt="MOBSMILE"
      className={`${className} transition-opacity ${transparentMark ? "opacity-100" : "opacity-0"}`}
      width={1024}
      height={1024}
    />
  );
}

export function LogoWordmark({ className = "h-8" }: { className?: string }) {
  const transparentLogo = useTransparentImage(fullLogo);

  return (
    <img
      src={transparentLogo ?? fullLogo}
      alt="MOBSMILE"
      className={`${className} w-auto object-contain transition-opacity ${transparentLogo ? "opacity-100" : "opacity-0"}`}
      width={3000}
      height={3000}
    />
  );
}
