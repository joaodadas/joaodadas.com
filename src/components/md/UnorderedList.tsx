import React, { type ReactNode } from "react";

interface UnorderedListProps {
  children: ReactNode;
}

const UnorderedList = ({ children }: UnorderedListProps) => {
  return <ul className="text-muted-foreground text-base list-disc pl-6 marker:text-foreground mt-2">{children}</ul>;
};

export default UnorderedList;
