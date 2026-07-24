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
      {
        protocol: "https",
        hostname: "m0xcz6d4a4.ufs.sh",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
