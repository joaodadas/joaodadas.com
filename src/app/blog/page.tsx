import { posts } from "#site/content";
import type { Metadata } from "next";
import ContentWrapper from "~/components/ContentWrapper";
import PostPreview from "~/components/PostPreview";

export const metadata: Metadata = {
  title: "Blog - João Vitor Dadas",
};

export default function BlogPage() {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <ContentWrapper>
      <ul className="flex flex-col">
        {sortedPosts.map((post) => (
          <li key={post.slug}>
            <PostPreview
              title={post.title}
              description={post.description}
              date={post.date}
              slug={post.slug}
              showDate
            />
          </li>
        ))}
      </ul>
    </ContentWrapper>
  );
}
