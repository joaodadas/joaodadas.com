"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import LinkTextFooter from "~/components/md/LinkTextFooter";
import PostPreview from "~/components/PostPreview";
import { posts } from "#site/content";

type Project = {
  name: string;
  description: string;
  href: string;
  logo: string;
  /**
   * Logo de uma cor só: é usado como máscara e pintado com a cor do texto,
   * então acompanha o tema claro/escuro sozinho.
   */
  mono?: boolean;
  /** Versão do logo colorido para o tema escuro, quando o original some no fundo. */
  logoDark?: string;
};

const PROJECTS: readonly Project[] = [
  {
    name: "Horizonte",
    description: "Co-founder (fintech)",
    href: "https://horizonteinveste.ai/",
    logo: "/logos/horizonte.svg",
    mono: true,
  },
  {
    name: "Lyx",
    description: "Tech Lead (construction)",
    href: "https://www.lyx.com.br/",
    logo: "/logos/lyx.png",
    mono: true,
  },
  {
    name: "Ashmont",
    description: "Founder (holding)",
    href: "https://ashmont.studio/",
    logo: "/logos/ashmont.svg",
    mono: true,
  },
  {
    name: "Clynea",
    description: "Co-founder (healthtech)",
    href: "https://clynea.ai/",
    logo: "/logos/clynea.png",
  },
  {
    name: "EBANX",
    description: "Software Engineer (fintech)",
    href: "https://www.ebanx.com/en/",
    logo: "/logos/ebanx.svg",
  },
  {
    name: "CargOn",
    description: "Software Engineer (logtech)",
    href: "https://cargon.com.br/esg/",
    logo: "/logos/cargon.svg",
    logoDark: "/logos/cargon-dark.svg",
  },
  {
    name: "CCC",
    description: "Curitiba Code Club (Member)",
    href: "https://lu.ma/-ccc?k=c",
    logo: "/logos/ccc.png",
    mono: true,
  },
];

const LOGO_CLASS = "h-3.5 w-3.5 shrink-0 rounded-[3px] object-contain";

function ProjectLogo({ project }: { project: Project }) {
  // Decorativo: o nome do projeto vem logo ao lado, então alt vazio.
  if (project.mono) {
    const mask = `url(${project.logo}) center / contain no-repeat`;
    return (
      <span
        aria-hidden
        className="h-3.5 w-3.5 shrink-0 bg-primary dark:bg-foreground"
        style={{ mask, WebkitMask: mask }}
      />
    );
  }

  if (!project.logoDark) {
    return (
      <Image
        src={project.logo}
        alt=""
        width={14}
        height={14}
        className={LOGO_CLASS}
      />
    );
  }

  return (
    <>
      <Image
        src={project.logo}
        alt=""
        width={14}
        height={14}
        className={`${LOGO_CLASS} dark:hidden`}
      />
      <Image
        src={project.logoDark}
        alt=""
        width={14}
        height={14}
        className={`${LOGO_CLASS} hidden dark:block`}
      />
    </>
  );
}

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
          Co-founder of Horizonte · Tech Lead at Lyx
        </p>
        <div className="mt-6 flex flex-col gap-4 text-base text-foreground">
          <p>
            I&apos;m a founder and software engineer in my twenties from Brazil.
            Beyond technology, AI and design, I like understanding companies in
            depth, especially how they operate.
          </p>
          <p>
            I&apos;m building Horizonte, an AI-powered ecosystem for investors.
            It&apos;s live in Brazil today, already with its first subscribers,
            and wealth management and Open Finance integration are on the way.
            I&apos;m also Tech Lead at Lyx, and Ashmont is the holding behind
            everything I start.
          </p>
        </div>
      </div>

      {/* PROJECTS */}
      <div className={`mt-10 ${shouldAnimate ? "animate-7" : ""}`}>
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
                <div className="flex min-w-0 items-center gap-2">
                  <ProjectLogo project={project} />
                  <div className="flex min-w-0 items-center gap-0.5">
                    <span className="truncate text-base font-medium text-primary dark:text-foreground group-hover:underline underline-offset-2">
                      {project.name}
                    </span>
                    <span className="text-muted-foreground">
                      <svg
                        width={14}
                        height={14}
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="arrow-draw"
                      >
                        <path
                          d="M4 11L11 4M11 4H6M11 4V9"
                          stroke="currentColor"
                          strokeWidth={1.2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          pathLength={1}
                        />
                      </svg>
                    </span>
                  </div>
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
      <div className={`mt-10 ${shouldAnimate ? "animate-10" : ""}`}>
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
      <div className="mt-10 flex flex-wrap items-center gap-6 pb-12 text-sm">
        <LinkTextFooter href="https://x.com/joaodadas">X</LinkTextFooter>
        <LinkTextFooter href="https://github.com/joaodadas">
          GitHub
        </LinkTextFooter>
        <LinkTextFooter href="https://www.linkedin.com/in/jo%C3%A3o-vitor-dadas/">
          LinkedIn
        </LinkTextFooter>
      </div>
    </>
  );
}
