import { type ReactNode } from "react";

interface CodeProps {
  children: ReactNode;
  [key: string]: unknown;
}

const Code = ({ children, ...props }: CodeProps) => {
  return (
    <pre
      className="my-4 overflow-x-auto rounded-lg border border-border bg-transparent p-4 text-sm"
      {...props}
    >
      {children}
    </pre>
  );
};

export default Code;
