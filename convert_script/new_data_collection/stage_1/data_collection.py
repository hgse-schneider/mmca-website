import pandas as pd
import json
''' 
Guidance:
This script takes in two CSV files, one containing the metrics data and one containing the paper meta data.
It combines the two and outputs the data into a JSON format. There are a number of parameters you can use
to change its behaviour, including setting which fields to use in generating the output file,
converting fields to array fields within the JSON, and deciding how many papers to use. 

How-to:
You can run this file using:
$ py data_collection.py

You should ensure all parameters specified below are set to your desire before doing so.

Parameters:
--> METRIC_PATH: location of input metric data
--> META_PATH: location of input meta data
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

IMPORTANT NOTES:
 - Currently doesn't work with empty lines in the data. Will hopefully fix soon, but for now
 - have to manually edit CSV files first to ensure all data is contiguous
'''

# TODO: Handle input files having empty lines

METRIC_PATH = "paper_metrics_constructs.csv"
META_PATH = "paper_meta.csv"
JSON_PATH = "data.JSON"
FINAL_CODED = 74
ALL_PAPERS = True
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
    "analysis_and_results mm-oo:analysis:resultsig",
    "title",
    "year",
    "authors",
    "data_per_metric"
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
                "outcome_larger_category",
                "analysis_and_results mm-oo:analysis:resultsig"]

def CSV_to_JSON():
    # Read in data

    # This often hits this error: pandas.errors.IntCastingNaNError: Cannot convert non-finite values (NA or inf) to integer
    # I've dealt with before, how to fix this again? Open in Excel, delete all rows beneath the space/gap, save file, try again

    metric_data = pd.read_csv(METRIC_PATH)
    meta_data = pd.read_csv(META_PATH)

    # Cleaning rows where we don't have a valid paper id
    # NOTE: Can remove the map to strings once other rows have been removed
    meta_data_clean = meta_data[meta_data["paper_id_new"].isin(list(map(lambda x: str(x), list(range(1, 200)))))]
    metric_data_clean = metric_data[metric_data["paper_id_new"].isin(list(map(lambda x: x, list(range(1, 200)))))]

    # These should be the same shape. If not, check the dataset to ensure same papers in both
    # Metrics and meta
    assert(metric_data_clean.shape[0] == meta_data_clean.shape[0])

    # Safety conversion to ensure merge completes correctly
    meta_data_safe = meta_data_clean.astype({"paper_id_new": "int"})
    metric_data_safe = metric_data_clean.astype({"paper_id_new": "int"})

    # Combining files
    combined = pd.merge(meta_data_safe, metric_data_safe, how="left", on="paper_id_new")
    # Dropping fields and papers we don't need unless we have ALL_FIELDS or ALL_PAPERS
    if not(ALL_FIELDS):
        combined.drop(list(filter(lambda x: not(x in USEFUL_FIELDS), list(combined.columns))), axis="columns", inplace=True)
    if not(ALL_PAPERS):
        combined.drop(list(range(FINAL_CODED + 1, combined.shape[0])), axis="rows", inplace=True)
    # Dump to JSON file. Pandas dataframes useful, but we can't convert things to arrays easily
    # which I would like in the JSON as the most sensible represenation of some of the data
    combined.to_json(JSON_PATH)
    # Pulling back from JSON we just wrote
    with open(JSON_PATH, 'r+') as f:
        combined = json.load(f)
        for field in combined:
            # For all the array fields, we will convert the data to arrays
            if field in ARRAY_FIELDS:
                for entry in combined[field]:
                        combined[field][entry] = str(combined[field][entry]).split('\n')
        
        # Writing JSON back to file. Reset file pointer and dump data back into file
        f.seek(0)
        json.dump(combined, f, indent=4)
        f.truncate()
    
    # Now taking transpose to organize data by paper
    combined = pd.read_json(JSON_PATH).transpose()
    combined.to_json(JSON_PATH)

CSV_to_JSON()