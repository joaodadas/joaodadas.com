import React, { type ReactNode } from "react";

interface PProps {
  children: ReactNode;
}

const P = ({ children }: PProps) => {
  return <p className="text-foreground/85 text-base">{children}</p>;
};

export default P;