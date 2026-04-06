import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    lang: z.string().default('en'),
    ageGroup: z.array(z.string()).optional(),
    draft: z.boolean().optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    lang: z.string().default('en'),
    slug: z.string(),
    keywords: z.array(z.string()).optional(),
    category: z.string().optional(),
    affiliate: z.array(z.string()).optional(),
    type: z.string().default('pillar'),
  }),
});

export const collections = { blog, guides };
