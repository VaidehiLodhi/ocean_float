import { type NextConfig } from "next";
import path from "path";
import process from "process";
import CopyWebpackPlugin from "copy-webpack-plugin";

const pathBuilder = (subpath: string) => path.join(process.cwd(), subpath);

const nextConfig: NextConfig = {
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: pathBuilder("node_modules/cesium/Build/Cesium/Workers"),
            to: path.join(process.cwd(), "public/cesium/Workers"),
            info: { minimized: true },
          },
          {
            from: pathBuilder("node_modules/cesium/Build/Cesium/ThirdParty"),
            to: path.join(process.cwd(), "public/cesium/ThirdParty"),
            info: { minimized: true },
          },
          {
            from: pathBuilder("node_modules/cesium/Build/Cesium/Assets"),
            to: path.join(process.cwd(), "public/cesium/Assets"),
            info: { minimized: true },
          },
          {
            from: pathBuilder("node_modules/cesium/Build/Cesium/Widgets"),
            to: path.join(process.cwd(), "public/cesium/Widgets"),
            info: { minimized: true },
          },
        ],
      }),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("/cesium"),
      })
    );

    return config;
  },
  output: "standalone",
};

export default nextConfig;
