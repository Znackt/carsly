"use client";

import { useIsMobile } from "@/hooks/use-mobile";

interface Header3Props {
  Header: string | undefined;
}

const Header4Component = ({ Header }: Header3Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className={`text-md font-semibold px-2`}>{Header}</div>;
  }

  return <div className={`text-xl font-bold px-1`}>{Header}</div>;
};

export { Header4Component }; 