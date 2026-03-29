import React, { type ReactNode } from "react";

interface LiProps {
  children: ReactNode;
}

const Li = ({ children }: LiProps) => {
  return <li className="py-1 text-muted-foreground">{children}</li>;
};

export default Li;