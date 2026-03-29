interface LinkTextFooterProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const LinkTextFooter = ({
  children,
  href,
  className = "",
}: LinkTextFooterProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 ${className}`}
    >
      <span>{children}</span>
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
    </a>
  );
};

export default LinkTextFooter;
