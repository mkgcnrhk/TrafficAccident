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
  
  const [filterPref, setFilterPref] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<number | 'all'>('all');

  useEffect(() => {
    fetch('/data/accidents_2024.json')
      .then(res => res.json())
      .then((json: AccidentJSON) => {
        setRawData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load JSON", err);
        setLoading(false);
      });
  }, []);

  const filteredData = useMemo(() => {
    if (!rawData) return [];
    
    let result = rawData.data;
    
    if (filterPref !== 'all') {
      result = result.filter(row => String(row[4]) === filterPref || String(row[4]).padStart(2, '0') === filterPref);
    }
    
    if (filterMonth !== 'all') {
      result = result.filter(row => row[0] === filterMonth);
    }
    
    return result.map(row => ({
      month: row[0] as number,
      day: row[1] as number,
      hour: row[2] as number,
      dayOfWeek: String(row[3]),
      prefCode: String(row[4]),
      accidentType: String(row[5]),
      partyA: String(row[6]),
      partyB: String(row[7]),
      fatalities: row[8] as number,
      injured: row[9] as number,
    }));
  }, [rawData, filterPref, filterMonth]);
  
  return {
    mappings: rawData?.mappings,
    data: filteredData,
    loading,
    filterPref, setFilterPref,
    filterMonth, setFilterMonth
  };
}
