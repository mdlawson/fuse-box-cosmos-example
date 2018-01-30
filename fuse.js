const { FuseBox, WebIndexPlugin, CSSPlugin, QuantumPlugin } = require("fuse-box");

const fuse = FuseBox.init({
  homeDir: "src",
  output: "dist/$name.js",
  target: "browser",
  allowSyntheticDefaultImports: true,
  sourceMaps: true,
  plugins: [
    CSSPlugin(),
    WebIndexPlugin({
      template: "src/index.html",
      title: "Hello World",
    }),
    QuantumPlugin({
      treeshake: true,
    }),
  ],
});
fuse.dev();

fuse
  .bundle("app")
  .watch()
  .hmr()
  .instructions("> index.tsx");
fuse.run();
