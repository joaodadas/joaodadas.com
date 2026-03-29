import React, { type ReactNode } from "react";

interface OrderedListProps {
  children: ReactNode;
}

const OrderedList = ({ children }: OrderedListProps) => {
  return <ul className="list-decimal text-muted-foreground text-base pl-8 marker:text-foreground mt-2">{children}</ul>;
};

export default OrderedList;
