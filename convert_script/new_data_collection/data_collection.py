import csv
import pandas as pd
import json

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
JSON_PATH = "data_test.JSON"
NUM_CODED = 75
ALL_FIELDS = True
DEBUG = True
DEBUG_PATH = 'debug.txt'
ARRAY_FIELDS = ["data", 
                "data_standardized", 
                "sensor", 
                "brand", 
                "metric", 
                "metric_larger_category", 
                "metric_smaller_category",
                "metric_IG_category",
                "data_per_metric",
                "data_metric_method",
                "outcome",
                "outcome_instrument",
                "outcome_smaller_category",
                "outcome_larger_category"]

def CSV_to_JSON():
    data = pd.read_csv(DATA_PATH)
    # .transpose().replace('\n',',', regex=True)
    # array_fields_indices = [data.get_loc(field) for field in ARRAY_FIELDS]
    # for col in data.columns:
    #     if col in ARRAY_FIELDS:
    #         for datapoint in col:
    #             counter += 1
    #             datapoint = "[" + datapoint + "]"
    data.transpose().replace('\n',',', regex=True)
    if ALL_FIELDS:
        data.to_json(JSON_PATH)
        return
    print(data)

CSV_to_JSON()