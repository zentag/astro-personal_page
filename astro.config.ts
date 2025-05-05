// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import qwikdev from "@qwikdev/astro";

import db from "@astrojs/db";

import netlify from "@astrojs/netlify";
const setLayout = () => {
  return function (_: any, file: any) {
    file.data.astro.frontmatter.layout =
      file.data.astro.frontmatter.layout || "../../layouts/BlogPost.astro";
  };
};

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    remarkPlugins: [setLayout],
  },

  integrations: [qwikdev(), db()],
  adapter: netlify(),
});
