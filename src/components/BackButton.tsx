import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type BackButtonProps = {
  href: string;
  className?: string;
};

const BackButton = ({ href, className = "" }: BackButtonProps) => {
  return (
    <div className={`pb-6 ${className}`}>
      <Link
        href={href}
        className="group inline-flex items-center gap-1 text-neutral-600 transition-colors duration-200 ease-in-out hover:text-neutral-400"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm">Back</span>
      </Link>
    </div>
  );
};

export default BackButton;
