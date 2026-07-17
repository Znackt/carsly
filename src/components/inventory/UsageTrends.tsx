
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendItem } from '../../lib/types';

interface Props {
  trendsData: TrendItem[];
}

export default function UsageTrends({ trendsData }: Props) {
  if (!trendsData || trendsData.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">Usage Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendsData.map((trend) => (
          <div key={trend.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{trend.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{trend.mainStat}</p>
            <p className="text-xs text-gray-500 mb-8 font-medium">
              Last 30 Days{' '}
              <span className={trend.isPositive ? 'text-green-600' : 'text-red-500'}>
                {trend.subStat}
              </span>
            </p>
            <div className="h-32 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend.chartData}>
                  {/* The hidden YAxis with a dynamic domain is the secret to making it look real */}
                  <YAxis 
                    hide 
                    domain={['dataMin - 5', 'dataMax + 5']} 
                  />
                  <Line
                    type="natural" // 'natural' gives that smooth, curvy look from the screenshot
                    dataKey="value"
                    stroke="#546e7a"
                    strokeWidth={2.5}
                    dot={false}
                    isAnimationActive={true}
                  />
                  <XAxis
                    dataKey="label" // We use a separate 'label' key to only show specific ticks
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    dy={15}
                    interval="preserveStartEnd"
                  />
                  {/* Optional: Add a tooltip to see the dynamic data on hover */}
                  <Tooltip 
                    cursor={false}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ display: 'none' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}