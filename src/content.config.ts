import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
export const GALLERY_PATH = "src/data/galleries";
export const MOMENTS_PATH = "src/data/moments";
export const NOVELLA_PATH = "src/data/novella";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const galleries = defineCollection({
  loader: glob({ pattern: "**/index.{md,mdx}", base: `./${GALLERY_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDatetime: z.date(),
      draft: z.boolean().optional(),
      coverImage: image().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

const moments = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${MOMENTS_PATH}` }),
  schema: () =>
    z.object({
      title: z.string().optional(),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      draft: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const novella = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${NOVELLA_PATH}` }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string().default("A short fiction piece."),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["novella"]),
      timezone: z.string().optional(),
    }),
});

export const collections = { blog, galleries, moments, novella };
