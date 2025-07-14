import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/main.tsx"],

  format: ["esm"],
  target: "esnext",
  platform: "node",

  dts: false,
  minify: true,
  removeNodeProtocol: false,
  sourcemap: true,
  clean: true,
})
