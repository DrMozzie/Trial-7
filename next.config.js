const { withGlobalCss } = require("next-global-css");

const withConfig = withGlobalCss();

/** @type {import('next').NextConfig} */
module.exports = withConfig({
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "s.gravatar.com",
      "unifriends.s3.amazonaws.com",
      "dweb.link",
      "ipfs.io",
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
