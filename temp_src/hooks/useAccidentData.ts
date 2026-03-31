import { useState, useEffect, useMemo } from 'react';

export type MappingType = Record<string, string>;

export type AccidentJSON = {
  mappings: {
    pref_code: MappingType;
    accident_type: MappingType;
    party_type: MappingType;
    day_of_week: MappingType;
  };
  data: (number | string)[][];
};

export type AccidentRecord = {
  month: number;
  day: number;
  hour: number;
  dayOfWeek: string;
  prefCode: string;
  accidentType: string;
  partyA: string;
  partyB: string;
  fatalities: number;
  injured: number;
};

export function useAccidentData() {
  const [rawData, setRawData] = useState<AccidentJSON | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filterPref, setFilterPref] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<number | 'all'>('all');

  useEffect(() => {
    fetch('/data/accidents_2024.json')
      .then(res => res.json())
      .then((json: AccidentJSON) => {
        setRawData(json);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const filteredData = useMemo(() => {
    if (!rawData) return [];
    
    let result = rawData.data;
    
    if (filterPref !== 'all') {
      result = result.filter(row => row[4] === filterPref);
    }
    
    if (filterMonth !== 'all') {
      result = result.filter(row => row[0] === filterMonth);
    }
    
    return result.map(row => ({
      month: row[0] as number,
      day: row[1] as number,
      hour: row[2] as number,
      dayOfWeek: row[3] as string,
      prefCode: row[4] as string,
      accidentType: row[5] as string,
      partyA: row[6] as string,
      partyB: row[7] as string,
      fatalities: row[8] as number,
      injured: row[9] as number,
    }));
  }, [rawData, filterPref, filterMonth]);
  
  return {
    mappings: rawData?.mappings,
    data: filteredData,
    loading,
    filterPref,
    setFilterPref,
    filterMonth,
    setFilterMonth
  };
}
