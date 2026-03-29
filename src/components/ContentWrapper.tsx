import { type ReactNode } from "react";

type ContentWrapperProps = {
  children: ReactNode;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return <>{children}</>;
};

export default ContentWrapper;
