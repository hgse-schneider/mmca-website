import csv
import pandas as pd

''' 
Parameters:
--> DATA_PATH
--> JSON_PATH
--> NUM_CODED: 
--> ALL_FIELDS: If set to true, data output should contain all fields
--> DEBUG: 
--> DEBUG_PATH:
'''

DATA_PATH = "data_raw.csv"
JSON_PATH = "data.JSON"
NUM_CODED = 75
ALL_FIELDS = True
DEBUG = True
DEBUG_PATH = 'debug.txt'

def CSV_to_JSON():
    data = pd.read_csv(DATA_PATH).transpose().replace('\n',' ', regex=True)
    if ALL_FIELDS:
        data.to_json(JSON_PATH)
        return
    print(data)

CSV_to_JSON()