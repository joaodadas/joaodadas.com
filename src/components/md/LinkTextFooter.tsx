import Link from "next/link";

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
    <Link
      href={href}
      className={`text-muted-foreground transition duration-200 ease-in-out hover:text-foreground ${className}`}
    >
      {children}
    </Link>
  );
};

export default LinkTextFooter;
