/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["localhost", "safe-edu-s3.s3.ap-southeast-2.amazonaws.com"],
  },
};

export default nextConfig;
