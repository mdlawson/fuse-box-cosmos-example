import {
  FuseBox,
  WebIndexPlugin,
  EnvPlugin,
  QuantumPlugin,
  CSSPlugin,
  CSSModules,
  PostCSSPlugin,
} from "fuse-box";
import { task, src } from "fuse-box/sparky";
import { TypeHelper } from "fuse-box-typechecker";

const typechecker = TypeHelper({
  name: "src",
  basePath: "./",
  tsConfig: "./tsconfig.json",
});

task("default", ["clean"], () => {
  config({
    env: "development",
    serve: "./dist",
  }).run();
  typechecker.runWatch("src");
});

task("clean", () => src("./dist").clean("./dist"));

task("dist", ["clean"], () => {
  const fuse = config({
    env: "production",
    serve: "./dist",
  });
  typechecker.runSync();
  fuse.run();
});

task("cosmos", ["clean"], () => {
  config({
    env: "playground",
    out: "./dist/playground",
    entry: "playground.ts",
  }).run();

  config({
    env: "development",
    out: "./dist/playground/loader",
    path: "/loader",
    entry: "loader.ts",
    serve: "./dist/playground",
    port: 4445,
  }).run();

  typechecker.runWatch("src");
});

interface Options {
  env: string;
  out?: string;
  entry?: string;
  path?: string;
  serve?: string;
  port?: number;
}

function config({ env, out, entry, path, serve, port }: Options) {
  const isDev = env === "development";
  const isProd = env === "production";
  out = out || "./dist";
  entry = entry || "index.tsx";
  port = port || 4444;
  path = path || "/";

  const fuse = FuseBox.init({
    homeDir: "src",
    output: `${out}/$name.js`,
    hash: true,
    sourceMaps: true,
    cache: isDev,
    useJsNext: true,
    allowSyntheticDefaultImports: true,
    target: "browser@es2015",
    alias: {
      components: "~/components",
      css: "~/css",
    },
    plugins: [
      EnvPlugin({ NODE_ENV: env }),
      WebIndexPlugin({
        path,
        template: "src/index.html",
        title: "Hello World",
      }),
      [
        CSSModules({
          scopedName: "[name]__[local]___[hash:base64:3]",
        }),
        CSSPlugin(),
      ],
      isProd &&
        QuantumPlugin({
          bakeApiIntoBundle: "vendor",
          processPolyfill: true,
          ensureES5: false,
          treeshake: true,
          css: { clean: true, path: "app.css" },
          uglify: true,
          cleanCSS: true, // TODO: remove
        }),
    ],
  });

  const vendor = fuse.bundle(`vendor`).instructions(`~ ${entry}`);
  const app = fuse.bundle(`app`).instructions(`!> [${entry}]`);

  if (serve) {
    fuse.dev({ port, root: serve });
  }

  if (isDev) {
    vendor.hmr();
    app.watch().hmr();
  }

  return fuse;
}
