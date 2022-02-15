import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import html from "@open-wc/rollup-plugin-html";
import replace from "@rollup/plugin-replace";
import strip from "@rollup/plugin-strip";
import copy from "rollup-plugin-copy";
import typescript from "@rollup/plugin-typescript";
import filesize from 'rollup-plugin-filesize';
import minifyHTML from 'rollup-plugin-minify-html-literals';

export default {
  input: "build/index.html",
  preserveEntrySignatures: 'strict',
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [
    html(),
    resolve(),
    filesize(
      {
        showMinifiedSize: false,
        showBrotliSize: true
      }
    ),
    minifyHTML(),
    replace({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
    }),
    typescript({
      tsconfig: "tsconfig.json"
    }),
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    strip({
      functions: ["console.log"],
    }),
    copy({
      targets: [
        { src: "assets/**/*", dest: "dist/assets/" },
        { src: "styles/**/*", dest: "dist/styles/" },
        { src: "manifest.json", dest: "dist/" },
        { src: "fabric.min.js", dest: "dist/" },
        { src: ".well-known/**/*", dest: "dist/.well-known/"}
      ],
    }),
  ],
};
