import pandas as pd
import csv
import json
import os
import math

CODEBOOK_PATH = "data/codebook_2024.xlsx"
CSV_PATH = "data/honhyo_2024.csv"
OUT_PATH = "dashboard/public/data/accidents_2024.json"

def extract_mapping(xls, sheet_name):
    df = pd.read_excel(xls, sheet_name=sheet_name)
    mapping = {}
    
    for i in range(len(df)):
        col1 = str(df.iloc[i, 1])
        if 'コード' in col1:
            for j in range(i+1, len(df)):
                code = df.iloc[j, 1]
                name = df.iloc[j, 2]
                if pd.notna(code) and pd.notna(name):
                    try:
                        c = str(code).strip()
                        if c.endswith('.0'): c = c[:-2]
                        mapping[c] = str(name).strip()
                        c_zfill2 = c.zfill(2)
                        mapping[c_zfill2] = str(name).strip()
                    except:
                        pass
            break
            
    return mapping

def main():
    print("Codebooks parsing...")
    xls = pd.ExcelFile(CODEBOOK_PATH)
    mappings = {
        "pref_code": extract_mapping(xls, '都道府県'),
        "accident_type": extract_mapping(xls, '事故類型（本票）'),
        "party_type": extract_mapping(xls, '当事者種別'),
        "day_of_week": extract_mapping(xls, '曜日')
    }
    
    print("Parsing CSV data...")
    data = []
    
    with open(CSV_PATH, 'r', encoding='shift_jis', errors='replace') as f:
        reader = csv.reader(f)
        headers = next(reader)
        
        idx = {
            "month": headers.index("発生日時　　月"),
            "day": headers.index("発生日時　　日"),
            "hour": headers.index("発生日時　　時"),
            "minute": headers.index("発生日時　　分"),
            "day_of_week": headers.index("曜日(発生年月日)"),
            "pref_code": headers.index("都道府県コード"),
            "accident_type": headers.index("事故類型"),
            "party_A": headers.index("当事者種別（当事者A）"),
            "party_B": headers.index("当事者種別（当事者B）"),
            "fatalities": headers.index("死者数"),
            "injured": headers.index("負傷者数")
        }
        
        count = 0
        for row in reader:
            if not row: continue
            
            try:
                mo = int(row[idx["month"]])
                da = int(row[idx["day"]])
                ho = int(row[idx["hour"]])
                dow = row[idx["day_of_week"]].strip()
                pref = row[idx["pref_code"]].strip()
                atype = row[idx["accident_type"]].strip()
                pA = row[idx["party_A"]].strip()
                pB = row[idx["party_B"]].strip()
                fat = int(row[idx["fatalities"]])
                inj = int(row[idx["injured"]])
                
                # To minimize payload, push as an array
                data.append([mo, da, ho, dow, pref, atype, pA, pB, fat, inj])
            except ValueError:
                pass

            count += 1
            if count % 100000 == 0:
                print(f"Read {count} rows")
                
    print(f"Total rows extracted: {len(data)}")
    
    out_dir = os.path.dirname(OUT_PATH)
    if not os.path.exists(out_dir):
        os.makedirs(out_dir)
        
    print(f"Writing to {OUT_PATH}...")
    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        json.dump({"mappings": mappings, "data": data}, f, ensure_ascii=False, separators=(',', ':'))
        
    print("Done!")

if __name__ == '__main__':
    main()
