"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import LinkText from "~/components/md/LinkText";
import LinkTextFooter from "~/components/md/LinkTextFooter";
import PostPreview from "~/components/PostPreview";
import { posts } from "#site/content";

export default function Home() {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    if (shouldAnimate) {
      setTimeout(() => {
        setShouldAnimate(false);
      }, 2000);
    }
  }, [shouldAnimate]);

  const sortedPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <>
      {/* BIO */}
      <div className={shouldAnimate ? "animate-5" : ""}>
        <h1 className="text-2xl font-normal">João Vitor Dadas</h1>
        <p className="mt-1 text-lg text-muted-foreground">
          Somewhere between finance and tech
        </p>
      </div>

      {/* PROJECTS */}
      <div className={`mt-14 ${shouldAnimate ? "animate-7" : ""}`}>
        <h2 className="mb-4 text-sm text-muted-foreground">Projects</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <LinkText href="https://clynea.ai/" className="font-medium">
              Clynea
            </LinkText>
            <span className="text-sm text-muted-foreground">
              Co-founder <span className="italic">(healthtech)</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <LinkText href="https://www.ebanx.com/en/" className="font-medium">
              EBANX
            </LinkText>
            <span className="text-sm text-muted-foreground">
              Software Engineer <span className="italic">(fintech)</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <LinkText href="https://cargon.com.br/esg/" className="font-medium">
              CargOn
            </LinkText>
            <span className="text-sm text-muted-foreground">
              Software Engineer <span className="italic">(logtech)</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <LinkText href="https://lu.ma/-ccc?k=c" className="font-medium">
              CCC
            </LinkText>
            <span className="text-sm text-muted-foreground">
              Curitiba Code Club (Member)
            </span>
          </div>
        </div>
      </div>

      {/* ARTICLES */}
      <div className={`mt-14 ${shouldAnimate ? "animate-10" : ""}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm text-muted-foreground">Articles</h2>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground transition duration-200 ease-in-out hover:text-foreground"
          >
            view all
          </Link>
        </div>
        <ul className="flex flex-col">
          {sortedPosts.map((post) => (
            <motion.li key={post.slug}>
              <PostPreview
                title={post.title}
                description={post.description}
                date={post.date}
                slug={post.slug}
                showDate={false}
              />
            </motion.li>
          ))}
        </ul>
      </div>

      {/* FOOTER LINKS */}
      <div className="mt-14 flex flex-wrap items-center gap-6 pb-12 text-sm">
        <LinkTextFooter href="https://x.com/joaodadas">X</LinkTextFooter>
        <LinkTextFooter href="https://github.com/joaodadas">
          GitHub
        </LinkTextFooter>
        <LinkTextFooter href="https://www.linkedin.com/in/jo%C3%A3o-vitor-dadas/">
          LinkedIn
        </LinkTextFooter>
        <LinkTextFooter href="mailto:dadasjv@hotmail.com">Email</LinkTextFooter>
        <LinkTextFooter href="https://noon-peace-17b.notion.site/Jo-o-Vitor-Dadas-13723ef5b82580bbb164ced6a2b3633d?pvs=4">
          Resume
        </LinkTextFooter>
      </div>
    </>
  );
}
