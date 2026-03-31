import { useMemo } from 'react';
import { AccidentRecord, MappingType } from '@/hooks/useAccidentData';

export function PrefectureRankingTable({ data, mapping }: { data: AccidentRecord[], mapping?: MappingType }) {
  const ranking = useMemo(() => {
    const counts: Record<string, { total: number, fatalities: number, injured: number }> = {};
    
    data.forEach(d => {
      let prefCode = String(d.prefCode);
      if (prefCode.length === 1) prefCode = '0' + prefCode;
      
      const prefName = mapping?.[prefCode] || mapping?.[d.prefCode] || `コード${d.prefCode}`;
      
      if (!counts[prefName]) {
        counts[prefName] = { total: 0, fatalities: 0, injured: 0 };
      }
      counts[prefName].total++;
      counts[prefName].fatalities += d.fatalities;
      counts[prefName].injured += d.injured;
    });

    return Object.entries(counts)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.total - a.total);
  }, [data, mapping]);

  return (
    <div className="h-72 overflow-y-auto pr-2 relative shadow-inner rounded-b-xl border border-t-0 border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0 shadow-sm z-10 border-b border-slate-200">
          <tr>
            <th scope="col" className="px-3 py-3 font-semibold">順位</th>
            <th scope="col" className="px-3 py-3 font-semibold">都道府県</th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">事故件数</th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">死者数</th>
            <th scope="col" className="px-3 py-3 text-right font-semibold">負傷者数</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {ranking.map((pref, idx) => (
            <tr key={pref.name} className="hover:bg-blue-50/50 transition-colors">
              <td className="px-3 py-2.5 text-slate-900 border-b border-slate-100">
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${idx < 3 ? 'bg-blue-100 text-blue-800 font-bold' : 'text-slate-500'}`}>
                  {idx + 1}
                </span>
              </td>
              <td className="px-3 py-2.5 border-b border-slate-100 font-medium text-slate-700">{pref.name}</td>
              <td className="px-3 py-2.5 border-b border-slate-100 text-right text-slate-900 font-medium">{pref.total.toLocaleString()}</td>
              <td className="px-3 py-2.5 border-b border-slate-100 text-right text-red-600 font-medium">{pref.fatalities > 0 ? pref.fatalities.toLocaleString() : '-'}</td>
              <td className="px-3 py-2.5 border-b border-slate-100 text-right text-orange-500 font-medium">{pref.injured > 0 ? pref.injured.toLocaleString() : '-'}</td>
            </tr>
          ))}
          {ranking.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-8 text-slate-500 relative">データがありません</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
