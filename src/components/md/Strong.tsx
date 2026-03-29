import React, { type ReactNode } from "react";

interface StrongProps {
  children: ReactNode;
}

const Strong = ({ children }: StrongProps) => {
  return <span className="text-foreground base font-normal">{children}</span>;
};

export default Strong;