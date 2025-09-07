"use client";

import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  Header: String;
}

interface SubHeaderProps {
  SubHeader: string;
}

const HeaderComponent = ({ Header }: HeaderProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className={`text-2xl font-semibold px-2`}>{Header}</div>;
  }

  return <div className={`text-3xl font-semibold px-2`}>{Header}</div>;
};

const SubHeaderComponent = ({ SubHeader }: SubHeaderProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <div className={`text-md font-semibold px-2`}>{SubHeader}</div>;
  }

  return <div className={`text-lg font-semibold px-2`}>{SubHeader}</div>;
};

export { HeaderComponent, SubHeaderComponent };
