import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AccidentRecord, MappingType } from '@/hooks/useAccidentData';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#a855f7', '#64748b'];

export function AccidentTypePieChart({ data, mapping }: { data: AccidentRecord[]; mapping?: MappingType }) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(d => {
      // Find label
      let label = d.accidentType;
      if (mapping) {
        label = mapping[d.accidentType.padStart(2, '0')] 
             || mapping[d.accidentType] 
             || `不明(${d.accidentType})`;
      }
      
      counts[label] = (counts[label] || 0) + 1;
    });
    
    let entries = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
      
    // Group remaining into 'その他' if more than 5
    if (entries.length > 5) {
      const top = entries.slice(0, 5);
      const other = entries.slice(5).reduce((sum, e) => sum + e.value, 0);
      top.push({ name: 'その他', value: other });
      return top;
    }
    return entries;
  }, [data, mapping]);

  return (
    <div className="h-72 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            outerRadius={90}
            innerRadius={55}
            paddingAngle={2}
            dataKey="value"
            animationDuration={1500}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#1f2937', fontSize: '13px' }}
            formatter={(value: any) => [`${Number(value).toLocaleString()}件`, '事故件数']}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
