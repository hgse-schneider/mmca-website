import pandas as pd
import json
''' 
Parameters:
--> DATA_PATH: location of input data
--> JSON_PATH: desired location/name of output data (must end .JSON)
--> FINAL_CODED: paper_id_new of final paper that has been completely coded 
--> ALL_PAPERS: If set to True, data ouptut shold contain all papers (including incompletely coded ones/whatever is in the csv)
                Else will be restricted to papers 1 to FINAL_CODED
--> ALL_FIELDS: If set to True, data output should contain all fields. 
                Else output will be restricted to fields in USEFUL_FIELDS
--> DEBUG: Currently not implemented
--> DEBUG_PATH: Currently not implemented
--> USEFUL_FIELDS: array of fields desired in final JSON result
--> ARRAY_FIELDS: array of fields that should be converted to an array
'''

DATA_PATH = "data_raw.csv"
JSON_PATH = "data.JSON"
FINAL_CODED = 74
ALL_PAPERS = False
ALL_FIELDS = False
# DEBUG = False
# DEBUG_PATH = 'debug.txt'
USEFUL_FIELDS = [
    "paper_id_new",
    "data_standardized",
    "sensor",
    "metric", 
    "metric_larger_category", 
    "metric_smaller_category",
    "outcome",
    "outcome_larger_category", 
    "outcome_smaller_category",
    "outcome_instrument",
    "analysis_and_results mm-oo:analysis:resultsig"
]
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
    # Read in data
    data = pd.read_csv(DATA_PATH)
    # Dropping fields and papers we don't need unless we have ALL_FIELDS or ALL_PAPERS
    if not(ALL_FIELDS):
        data.drop(list(filter(lambda x: not(x in USEFUL_FIELDS), list(data.columns))), axis="columns", inplace=True)
    if not(ALL_PAPERS):
        data.drop(list(range(FINAL_CODED + 1, data.shape[0])), axis="rows", inplace=True)
    # Dump to JSON file. Pandas dataframes useful, but we can't convert things to arrays easily
    # which I would like in the JSON as the most sensible represenation of some of the data
    data.to_json(JSON_PATH)
    # Pulling back from JSON we just wrote
    with open(JSON_PATH, 'r+') as f:
        data = json.load(f)
        for field in data:
            # For all the array fields, we will convert the data to arrays
            if field in ARRAY_FIELDS:
                for entry in data[field]:
                        data[field][entry] = str(data[field][entry]).split('\n')
        
        # Writing JSON back to file. Reset file pointer and dump data back into file
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()
    
    # Now taking transpose to organize data by paper
    data = pd.read_json(JSON_PATH).transpose()
    data.to_json(JSON_PATH)

CSV_to_JSON()