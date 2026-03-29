import { type ReactNode } from "react";

interface CodeProps {
  children: ReactNode;
  [key: string]: unknown;
}

const Code = ({ children, ...props }: CodeProps) => {
  return (
    <pre
      className="my-4 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  );
};

export default Code;
