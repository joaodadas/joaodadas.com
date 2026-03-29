import { posts } from "#site/content";
import { notFound } from "next/navigation";
import BackButton from "~/components/BackButton";
import ContentWrapper from "~/components/ContentWrapper";
import { MDXContent } from "~/components/mdx-content";
import Code from "~/components/md/Code";
import CustomImage from "~/components/md/CustomImage";
import H1 from "~/components/md/H1";
import H2 from "~/components/md/H2";
import H3 from "~/components/md/H3";
import Hr from "~/components/md/Hr";
import Li from "~/components/md/Li";
import LinkText from "~/components/md/LinkText";
import OrderedList from "~/components/md/OrderedList";
import P from "~/components/md/P";
import PostHeader from "~/components/PostHeader";
import Quote from "~/components/md/Quote";
import Strong from "~/components/md/Strong";
import UnorderedList from "~/components/md/UnorderedList";

const mdxComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  strong: Strong,
  li: Li,
  p: P,
  a: LinkText,
  blockquote: Quote,
  ul: UnorderedList,
  ol: OrderedList,
  img: CustomImage,
  pre: Code,
  hr: Hr,
};

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} - João Vitor Dadas`,
    description: post.description,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const readTime = `${Math.ceil(post.body.split(" ").length / 180)} min`;

  return (
    <ContentWrapper>
      <BackButton href="/blog" />
      <PostHeader title={post.title} date={post.date} readTime={readTime} />
      <MDXContent code={post.body} components={mdxComponents} />
    </ContentWrapper>
  );
}
