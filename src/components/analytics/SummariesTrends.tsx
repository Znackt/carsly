"use client"

import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendWidget } from '../../lib/types';

// Custom shape to match the exact bar design (light body, dark top cap)
const CustomBarShape = (props: any) => {
  const { x, y, width, height } = props;
  return (
    <g>
      {/* Light gray body of the bar */}
      <rect x={x} y={y} width={width} height={height} fill="#f1f5f9" />
      {/* Dark slate top cap / border */}
      <rect x={x} y={y} width={width} height={3} fill="#64748b" />
    </g>
  );
};

interface Props {
  trendsData: TrendWidget[];
}

export default function SummariesTrends({ trendsData }: Props) {
  if (!trendsData || trendsData.length === 0) return null;

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-xl font-bold mb-6">Summaries and Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {trendsData.map((trend) => (
          <div key={trend.id} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col">
            <h3 className="text-sm font-medium text-gray-900 mb-3">{trend.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{trend.mainStat}</p>
            <p className="text-xs text-gray-500 mb-8 font-medium">
              Last 7 Days{' '}
              <span className={trend.isPositive ? 'text-green-600' : 'text-red-500'}>
                {trend.subStat}
              </span>
            </p>
            
            <div className="h-40 w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                {trend.type === 'line' ? (
                  <LineChart data={trend.chartData}>
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Line
                      type="natural"
                      dataKey="value"
                      stroke="#546e7a"
                      strokeWidth={2.5}
                      dot={false}
                      isAnimationActive={true}
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                      dy={15}
                      interval="preserveStartEnd"
                    />
                    <Tooltip 
                      cursor={false}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ display: 'none' }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={trend.chartData} barSize={24}>
                    <YAxis hide domain={[0, 'dataMax + 10']} />
                    <Bar 
                      dataKey="value" 
                      shape={<CustomBarShape />} 
                      isAnimationActive={true} 
                    />
                    <XAxis
                      dataKey="label"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                      dy={15}
                    />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelStyle={{ display: 'none' }}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}