interface StatProps {
  title: string;
  value: string;
changePercentage: string;
}

const StatCard = ({ title, value, changePercentage }: StatProps) => {
  const isPositive = parseInt(changePercentage) >= 0;

  return (
    <div className="bg-[#f2f2f2] rounded-lg py-4 px-4 sm:py-6 sm:px-6 gap-1 flex flex-col justify-start min-w-0 w-full">
      <h3 className="text-gray-600 text-base font-medium">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <span
        className={`text-sm font-medium ${
          isPositive ? "text-green-500" : "text-red-500"
        }`}
      >
        {isPositive ? "+" : ""}
        {changePercentage}%
      </span>
    </div>
  );
};

export default StatCard;
