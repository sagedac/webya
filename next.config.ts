import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // images.unsplash.com: fotos de muestra/mockup (webya.md sección 2,
    // reset del catálogo 2026-08-12) mientras un tenant no tiene fotos
    // reales de su propio negocio todavía — no para producto final.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
