export default function ResourceOverview({ overviewData }: any) {
  if (!overviewData || overviewData.length === 0) return null;

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-5">Resource Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {overviewData.map((item: any) => (
          <div key={item.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{item.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}