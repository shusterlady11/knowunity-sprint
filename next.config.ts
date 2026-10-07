import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets an iPhone on the same Wi-Fi open the dev server by the Mac's network address, so the prototype can be
  // checked on the phone. Dev only: production builds ignore it.
  allowedDevOrigins: ['192.168.*.*'],
  // Hides the dev server's "N" badge, which sits over the mic and the bottom buttons on the phone. Build and
  // runtime errors still show.
  devIndicators: false,
};

export default nextConfig;
