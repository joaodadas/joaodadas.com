import Link from "next/link";

interface LinkTextProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const LinkText = ({ children, href, className = "" }: LinkTextProps) => {
  return (
    <Link
      href={href}
      className={`text-foreground transition duration-200 ease-in-out hover:text-muted-foreground ${className}`}
    >
      {children}
    </Link>
  );
};

export default LinkText;
