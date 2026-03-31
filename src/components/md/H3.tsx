import React, { type ReactNode } from "react";

interface H3Props {
  children: ReactNode;
}

const H3 = ({ children }: H3Props) => {
  return <h3 className="text-lg text-foreground font-normal pt-12 pb-3">{children}</h3>;
};

export default H3;