"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import LinkTextFooter from "~/components/md/LinkTextFooter";
import PostPreview from "~/components/PostPreview";
import { posts } from "#site/content";

const PROJECTS = [
  {
    name: "Clynea",
    description: "Co-founder (healthtech)",
    href: "https://clynea.ai/",
  },
  {
    name: "EBANX",
    description: "Software Engineer (fintech)",
    href: "https://www.ebanx.com/en/",
  },
  {
    name: "CargOn",
    description: "Software Engineer (logtech)",
    href: "https://cargon.com.br/esg/",
  },
  {
    name: "CCC",
    description: "Curitiba Code Club (Member)",
    href: "https://lu.ma/-ccc?k=c",
  },
] as const;

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
        <ul className="flex flex-col gap-3">
          {PROJECTS.map((project) => (
            <li key={project.name}>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full min-w-0 flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
              >
                <div className="flex min-w-0 items-center gap-0.5">
                  <span className="truncate text-base font-medium text-foreground group-hover:underline underline-offset-2">
                    {project.name}
                  </span>
                  <span className="text-muted-foreground">
                    <svg
                      width={14}
                      height={14}
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9C12 9.27614 11.7761 9.5 11.5 9.5C11.2239 9.5 11 9.27614 11 9L11 4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <span className="text-sm text-muted-foreground sm:truncate sm:flex-1">
                  {project.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
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
