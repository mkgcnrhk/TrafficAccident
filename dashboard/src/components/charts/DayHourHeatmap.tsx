import { useMemo } from 'react';
import { AccidentRecord, MappingType } from '@/hooks/useAccidentData';

export function DayHourHeatmap({ data, mapping }: { data: AccidentRecord[], mapping?: MappingType }) {
  const chartData = useMemo(() => {
    const matrix: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    let maxCount = 0;
    
    data.forEach(d => {
      const dayIdx = parseInt(d.dayOfWeek) - 1; // 1: Sun -> 0, 7: Sat -> 6
      if (!isNaN(dayIdx) && dayIdx >= 0 && dayIdx < 7 && d.hour >= 0 && d.hour < 24) {
        matrix[dayIdx][d.hour]++;
        if (matrix[dayIdx][d.hour] > maxCount) {
          maxCount = matrix[dayIdx][d.hour];
        }
      }
    });
    
    return { matrix, maxCount };
  }, [data]);

  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full overflow-x-auto pt-4 pb-2">
      <div className="min-w-[600px]">
        <div className="flex mb-1">
          <div className="w-8"></div>
          {hours.map(h => (
            <div key={`hx-${h}`} className="flex-1 text-center text-[10px] text-slate-500">{h}</div>
          ))}
        </div>
        
        {chartData.matrix.map((dayRow, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex items-center mt-1 space-x-1">
            <div className="w-8 text-[11px] text-slate-500 font-medium text-center">{days[rowIdx]}</div>
            {dayRow.map((count, colIdx) => {
              const intensity = chartData.maxCount > 0 ? count / chartData.maxCount : 0;
              // linear from 0.05 to 1.0 opacity
              const opacity = Math.max(0.04, intensity);
              return (
                <div 
                  key={`cell-${rowIdx}-${colIdx}`} 
                  className="flex-1 h-8 rounded-sm transition-all duration-300 hover:ring-2 hover:ring-blue-400 cursor-pointer relative group flex items-center justify-center bg-blue-500"
                  style={{ opacity: opacity }}
                >
                  <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded z-50 whitespace-nowrap opacity-100">
                    {days[rowIdx]}曜日 {colIdx}時: {count.toLocaleString()}件
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
