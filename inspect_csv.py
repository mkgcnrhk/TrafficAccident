import csv
import pandas as pd
import json

def inspect():
    with open('inspect_output.txt', 'w', encoding='utf-8') as out:
        with open('c:/WORK/Antigravity/TrafficAccident/data/honhyo_2024.csv', 'r', encoding='shift_jis', errors='replace') as f:
            reader = csv.reader(f)
            headers = next(reader)
            out.write("====== HEADERS ======\n")
            out.write(json.dumps(headers, ensure_ascii=False) + "\n\n")
            out.write("====== FIRST ROW ======\n")
            out.write(json.dumps(next(reader), ensure_ascii=False) + "\n\n")

        out.write("\n====== EXCEL SHEETS: codebook ======\n")
        try:
            xls = pd.ExcelFile('c:/WORK/Antigravity/TrafficAccident/data/codebook_2024.xlsx')
            out.write("Sheets: " + str(xls.sheet_names) + "\n")
            df = pd.read_excel(xls, sheet_name=xls.sheet_names[0], nrows=20)
            out.write("\nFIRST SHEET HEADER:\n")
            out.write(df.to_string() + "\n")
        except Exception as e:
            out.write("Error reading codebook: " + str(e) + "\n")

        out.write("\n====== EXCEL SHEETS: fileteigisyo ======\n")
        try:
            xls = pd.ExcelFile('c:/WORK/Antigravity/TrafficAccident/data/fileteigisyo_2024.xlsx')
            out.write("Sheets: " + str(xls.sheet_names) + "\n")
            df = pd.read_excel(xls, sheet_name=xls.sheet_names[0], nrows=50)
            out.write("\nSHEET 0:\n")
            out.write(df.to_string() + "\n")
        except Exception as e:
            out.write("Error reading fileteigisyo: " + str(e) + "\n")

if __name__ == "__main__":
    inspect()
