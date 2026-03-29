import rehypePrettyCode from "rehype-pretty-code";
import { defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s.object({
    title: s.string(),
    description: s.string(),
    date: s.string(),
    slug: s.slug("posts"),
    emoji: s.string().optional(),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: "src",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { posts },
  mdx: {
    rehypePlugins: [[rehypePrettyCode, { theme: "github-light" }]],
    remarkPlugins: [],
  },
});
