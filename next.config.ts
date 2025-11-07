import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001", // Railsサーバのポート
        pathname: "/rails/active_storage/**", // ActiveStorageのパス
      },
      // 本番環境を想定した設定(例.ドメインを https://api.stickerbook.jp にする場合)
      // {
      //   protocol: "https",
      //   hostname: "api.stickerbook.jp",
      //   pathname: "/rails/active_storage/**",
      // },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
