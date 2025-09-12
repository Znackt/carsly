"use client";

import { useIsMobile } from "@/hooks/use-mobile";

interface Header3Props {
  Header: string;
}

const Header3Component = ({ Header }: Header3Props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className={`text-lg font-semibold px-2`}>{Header}</div>;
  }

  return <div className={`text-2xl font-bold px-1`}>{Header}</div>;
};

export { Header3Component };
