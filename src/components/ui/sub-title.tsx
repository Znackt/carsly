import { XnoxButton } from "./button";
import { Header4Component } from "./Header4";

interface SubTitleProps {
  title: string;
  description: string;
  buttonText: string;
  HeaderText: string;
}

const SubTitle: React.FC<SubTitleProps> = ({
  title,
  description,
  buttonText,
  HeaderText
}) => {
  return (
    <div className="pb-7">
      <div className="pl-3">
        <Header4Component Header={HeaderText} />
      </div>

      <div className="flex justify-between px-4 py-4">
        <div className="flex flex-col">
          <span className="font-semibold">{title}</span>
          <span className="text-[#70707A] text-sm">{description}</span>
        </div>
        <div className="flex items-center">
          <XnoxButton Text={buttonText} />
        </div>
      </div>
    </div>
  );
};

export default SubTitle;
