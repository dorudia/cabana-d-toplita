/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "platform-lookaside.fbsbx.com",
      "tqfrezgugisuegkivttd.supabase.co",
      "res.cloudinary.com",
    ],
  },
  webpack(config) {
    config.resolve.alias["@"] = path.resolve("./");
    return config;
  },
};

export default nextConfig;
