import pandas as pd
import json

'''
Guidance:
This script is designed to take the overall JSON data file created using data_collection.py
and refactor it into another JSON format to work well for the circular_packing plot.

How-to:
You can run this file using:
$ py reformat_data.py

You should ensure all parameters specified below are set to your desire before doing so.

Parameters:
--> INPUT_PATH: location of input data (must end .JSON)
--> OUTPUT_PATH: desired location/name of output data (must end .JSON)
--> FIELD_HIERARCHY: order of fields in diagram, first element highest
'''

INPUT_PATH = "data.JSON"
OUTPUT_PATH = "circle_data.JSON"
# Flipping hierarhcy order from the intuitive since pop removes from end
FIELD_HIERARHCY = ["outcome_larger_category", "outcome_smaller_category", "data_standardized", "metric"][::-1]


with open(INPUT_PATH, 'r') as f:
    data = pd.read_json(INPUT_PATH)
    new_data = {"name": "data",
                "children": []}
    # For each paper we do the following
    for paper in data:
        # Location of where will be adding data, children of main node (represents all graph data)
        pos = new_data["children"]

        # Recursive function to generate children for each paper
        def build_data(pos, hierarchy_list):
            # If at end of the hierarchy, we add a point corresponding to the paper in the position
            if not(hierarchy_list):
                pos.append({"name": data[paper]["title"], "value": 1, "id": data[paper]["paper_id_new"]})
                return
            # Else we pop what category we are considering
            category = hierarchy_list.pop()
            
            for feature in data[paper][category]:
                clean_feature = feature.split(") ")[1]
                # If pos currently is an empty children list, we add the feature!
                if not pos:
                    pos.append({"name": clean_feature, "children": []})
                    # Recursively call to fill the new children array we created with the next feature
                    build_data(pos[0]["children"], hierarchy_list)
                else:
                    # Otherwise check if the feature is already there.
                    found = False
                    for i in range(len(pos)):
                        # If so, we will build the next node there
                        if pos[i]["name"] == clean_feature:
                            build_data(pos[i]["children"], hierarchy_list)
                            found = True
                    # Else we must again add the feature with empty children and continue at the next level
                    if not found:
                        pos.append({"name": clean_feature, "children": []})
                        build_data(pos[-1]["children"], hierarchy_list)
            hierarchy_list.append(category)
            return
        
        build_data(pos, FIELD_HIERARHCY.copy())
    
    # Dump JSON to output file
    with open(OUTPUT_PATH, "w") as output_file:
        output_file.seek(0)
        json.dump(new_data, output_file, indent=4)
        output_file.truncate()

