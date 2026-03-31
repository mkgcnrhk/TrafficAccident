import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AccidentRecord } from '@/hooks/useAccidentData';

export function MonthlyTrendChart({ data }: { data: AccidentRecord[] }) {
  const chartData = useMemo(() => {
    const counts = Array(12).fill(0);
    data.forEach(d => {
      if (d.month >= 1 && d.month <= 12) counts[d.month - 1]++;
    });
    return counts.map((count, i) => ({ month: `${i + 1}月`, count }));
  }, [data]);

  return (
    <div className="h-72 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} width={80} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            name="事故件数"
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
            activeDot={{ r: 6 }} 
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
