import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/id/tentang",
        destination: "/id/profil",
        permanent: true,
      },
      {
        source: "/id/agenda",
        destination: "/id/outreach-dan-kiprah#agenda",
        permanent: true,
      },
      {
        source: "/en/agenda",
        destination: "/en/outreach-and-engagement#agenda",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      new URL(
        "https://m0xcz6d4a4.ufs.sh/f/HbK7H1AIAYm2NQUVII7E0AjYnxm7VuMtCHo41fBdPclwyOs9",
      ),
    ],
  },
};

export default nextConfig;
