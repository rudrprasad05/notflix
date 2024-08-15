/** @type {import('next').NextConfig} */
const nextConfig = {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "assets.example.com",
      port: "",
      pathname: "/account123/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      port: "3001",
      pathname: "*",
    },
  ],
  images: {
    domains: ["localhost"], // Add the allowed hostnames here
  },
};

export default nextConfig;
