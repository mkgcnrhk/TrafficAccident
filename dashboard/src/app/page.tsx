'use client';

import { useAccidentData } from '@/hooks/useAccidentData';
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart';
import { AccidentTypePieChart } from '@/components/charts/AccidentTypePieChart';
import { DayHourHeatmap } from '@/components/charts/DayHourHeatmap';
import { PrefectureRankingTable } from '@/components/charts/PrefectureRankingTable';
import { Activity, Car, Map, Clock, CalendarDays, LucideIcon } from 'lucide-react';
import { useMemo } from 'react';

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: LucideIcon, color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-slate-900">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { data, mappings, loading, filterPref, setFilterPref, filterMonth, setFilterMonth } = useAccidentData();

  const totalAccidents = data.length;
  const totalFatalities = useMemo(() => data.reduce((sum, d) => sum + d.fatalities, 0), [data]);
  const totalInjured = useMemo(() => data.reduce((sum, d) => sum + d.injured, 0), [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 font-medium tracking-wide">データを読み込んでいます...</p>
        </div>
      </div>
    );
  }

  // Pre-process for dropdowns
  const prefcodes = Object.keys(mappings?.pref_code || {}).sort();
  const months = Array.from({length: 12}, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100">
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 h-16 px-6 bg-opacity-95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto h-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mt-2 sm:mt-0">
          <div className="flex items-center space-x-3 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Car className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">交通事故分析ダッシュボード <span className="text-sm font-normal text-slate-500 ml-2">2024年版</span></h1>
          </div>
          
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <Map className="w-4 h-4 text-slate-500 ml-3 shrink-0" />
              <select 
                value={filterPref} 
                onChange={(e) => setFilterPref(e.target.value)}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer pl-2 pr-8 py-2 w-full sm:w-36 text-slate-700"
              >
                <option value="all">全国</option>
                {prefcodes.map(code => (
                  <option key={code} value={code}>{mappings?.pref_code[code]}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <CalendarDays className="w-4 h-4 text-slate-500 ml-3 shrink-0" />
              <select 
                value={filterMonth} 
                onChange={(e) => setFilterMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer pl-2 pr-8 py-2 w-full sm:w-28 text-slate-700"
              >
                <option value="all">全月</option>
                {months.map(m => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto pt-40 sm:pt-24 px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="総発生件数" value={totalAccidents} icon={Activity} color="bg-blue-100 text-blue-600" />
          <StatCard title="総死者数" value={totalFatalities} icon={Activity} color="bg-red-100 text-red-600" />
          <StatCard title="総負傷者数" value={totalInjured} icon={Activity} color="bg-orange-100 text-orange-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-blue-500" /> 月別の推移
              </h2>
            </div>
            {filterMonth !== 'all' ? (
              <div className="h-72 flex items-center justify-center text-slate-500">
                月が指定されているため全月推移は表示されません
              </div>
            ) : (
              <MonthlyTrendChart data={data} />
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-indigo-500" /> 事故類型の割合
              </h2>
            </div>
            <AccidentTypePieChart data={data} mapping={mappings?.accident_type} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2 overflow-hidden flex flex-col">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center mb-4">
              <Clock className="w-5 h-5 mr-2 text-emerald-500" /> 曜日・時間帯別の発生状況
            </h2>
            <div className="flex-1">
              <DayHourHeatmap data={data} mapping={mappings?.day_of_week} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[408px]">
            <div className="p-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <Map className="w-5 h-5 mr-2 text-orange-500" /> 都道府県別ランキング
              </h2>
            </div>
            <div className="flex-1 px-4 pb-4">
              {filterPref !== 'all' ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  都道府県が指定されています
                </div>
              ) : (
                <PrefectureRankingTable data={data} mapping={mappings?.pref_code} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
