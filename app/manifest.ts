import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gemütlich",
    short_name: "Gemütlich",
    description: "Your own cozy corner for learning German.",
    start_url: "/",
    display: "standalone",
    background_color: "#ede3cf",
    theme_color: "#ede3cf",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
