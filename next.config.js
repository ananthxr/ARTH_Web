/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  // Optimize images (optional, but good practice)
  images: {
    domains: [],
  },
  // Environment variables that should be available to the browser
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

module.exports = nextConfig