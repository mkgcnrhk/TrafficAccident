import pandas as pd

def inspect_mapping():
    xls = pd.ExcelFile('c:/WORK/Antigravity/TrafficAccident/data/codebook_2024.xlsx')
    sheets = ['都道府県', '事故類型（本票）', '当事者種別', '曜日']
    with open('c:/WORK/Antigravity/TrafficAccident/res_utf8.txt', 'w', encoding='utf-8') as f:
        for s in sheets:
            if s in xls.sheet_names:
                df = pd.read_excel(xls, sheet_name=s, nrows=20)
                f.write(f"--- Sheet: {s} ---\n")
                f.write(df.to_string() + "\n\n")
            
if __name__ == "__main__":
    inspect_mapping()
