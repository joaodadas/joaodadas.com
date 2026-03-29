import React, { type ReactNode } from "react";

interface PProps {
  children: ReactNode;
}

const P = ({ children }: PProps) => {
  return <p className="text-muted-foreground text-base">{children}</p>;
};

export default P;