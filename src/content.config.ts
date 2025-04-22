import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**.md", base: "./src/pages/blog/" }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    last_updated: z.string().transform((str) => new Date(str)),
    description: z.string(),
    thumbnail_url: z.string(),
  }),
});

export const collections = { blog };
