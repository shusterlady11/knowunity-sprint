import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets an iPhone on the same Wi-Fi open the dev server by the Mac's network address, so the prototype can be
  // checked on the phone. Dev only: production builds ignore it.
  // Covers the three private network ranges (home, office and phone-hotspot Wi-Fi), so switching networks
  // doesn't block the phone.
  allowedDevOrigins: ['192.168.*.*', '10.*.*.*', '172.*.*.*'],
  // Hides the dev server's "N" badge, which sits over the mic and the bottom buttons on the phone. Build and
  // runtime errors still show.
  devIndicators: false,
};

export default nextConfig;
