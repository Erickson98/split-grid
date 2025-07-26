import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import buble from "@rollup/plugin-buble";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";

// Necesario en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lee package.json sin usar import
const pkgRaw = await fs.readFile(path.join(__dirname, "package.json"), "utf-8");
const pkg = JSON.parse(pkgRaw);

export default [
  {
    input: "./src/index.js",
    output: [
      {
        name: "Split",
        file: pkg.main,
        format: "umd",
        sourcemap: false,
        banner: `/*! ${pkg.name} - v${pkg.version} */\n`,
      },
      {
        file: pkg.module,
        format: "esm",
        sourcemap: false,
      },
    ],
    plugins: [
      commonjs(),
      resolve(),
      json(),
      buble({
        exclude: "node_modules/**",
        objectAssign: "Object.assign",
        transforms: {
          forOf: false,
        },
      }),
    ],
  },
  {
    input: "./src/index.js",
    output: {
      name: "Split",
      file: pkg["minified:main"],
      format: "umd",
      sourcemap: true,
      banner: `/*! ${pkg.name} - v${pkg.version} */\n`,
    },
    plugins: [
      resolve(),
      json(),
      buble({
        exclude: "node_modules/**",
        objectAssign: "Object.assign",
        transforms: {
          forOf: false,
        },
      }),
      terser(),
    ],
  },
];
