import pandas as pd
import json
import re

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

'''
What would be ideal to get out to make life easy:
for each paper

Metrics are numbered 1) 2) etc
the two outcome categories are alphabeted A) B) etc

so if we get:
1-A: sup. machine learning: sig
2+3+4-A: sup. machine learning: sig
1+2+3+4-A: sup. machine learning: mixed
we want:
1: a
2: a
3: a
4: a
which means we want
[
    [outcome a, outcome a, both data standardizeds?, metric 1],
    [outcome a, outcome a, both data standardizeds?, metric 2],
    [outcome a, outcome a, both data standardizeds?, metric 3],
    [outcome a, outcome a, both data standardizeds?, metric 4],
]

'''
ANALYSIS = "analysis_and_results mm-oo:analysis:resultsig"


with open(INPUT_PATH, 'r') as f:
    data = pd.read_json(INPUT_PATH)
    new_data = {"name": "data",
                "children": []}
    # For each paper we do the following
    for paper in data:
        # Location of where will be adding data, children of main node (represents all graph data)
        pos = new_data["children"]

        # This will output all significant correlations between metric and outcome.
        # E.g. for paper with paper_id_new = 2, should output:
        # [('1', 'A'), ('2', 'A'), ('4', 'B'), ('1', 'B'), ('2', 'B')]
        def pair_metric_and_category(paper):
            links = set()
            for link in data[paper][ANALYSIS]:
                cleaned = link.split(": ")
                if len(cleaned) < 3:
                    print(data[paper])
                if cleaned[2].strip() == "nonsig":
                    continue
                split_links = re.findall(r"[\w']+|[.!?;]", cleaned[0])
                numbers = []
                chars = []
                for i in range(len(split_links)):
                    split_links[i] = split_links[i].strip()
                    if split_links[i].isnumeric():
                        numbers.append(split_links[i])
                    else:
                        chars.append(split_links[i])
                for number in numbers:
                    for char in chars:
                        links.add((number, char))
            # print(f"{paper}: {list(links)}")
            return list(links)

        # This outputs the data per metric, reformatted to list all possible links
        # E.g. 2) II&IV -> [('2', 'II'), ('2', 'IV')]
        # TODO: Check whether this separation on & is desired or combined categories desired
        def pair_data_and_metric(paper):
            links = set()
            for link in data[paper]['data_per_metric']:
                # TODO: Check whether I should split on & here, or do we want combined metric categories?
                split_links = re.findall(r"[\w']+|[.!?;]", link)
                numbers = []
                metric = []
                for i in range(len(split_links)):
                    split_links[i] = split_links[i].strip()
                    if split_links[i].isnumeric():
                        numbers.append(split_links[i])
                    else:
                        metric.append(split_links[i])
                for n in numbers:
                    for m in metric:
                        links.add((n, m))
            # print(f"{paper}: {list(links)}")
            return list(links)

        metric_category_pairs = pair_metric_and_category(paper)
        data_metric_links = pair_data_and_metric(paper)
        paper_useful_data = [data[paper][category] for category in FIELD_HIERARHCY]
        if paper == 4:
            print(paper_useful_data)
            print(f"metric-category: {metric_category_pairs}")
            print(f"data-metric: {data_metric_links}")
        # DATA PER METRIC CATEGORY CRUCIAL

        # Convert the output of metric_category_pairs to an array of arrays of info
        # E.g. [('1', 'A'), ('2', 'A'), ('4', 'B'), ('1', 'B'), ('2', 'B')], if we just consider ('1', 'A'), this should produce (for this data)
        # Should go to[["focussed gaze", "eye gaze", "performance", "product"], ["focussed gaze", "eye gaze", "performance", "product"]]
        def build_info(paper_useful_data, metric_category_pairs, data_metric_links):
            info_list = []
            for sig_result in metric_category_pairs:
                info = []
                # Find the correct metric
                metric_no, outcome_let = sig_result
                for metric in paper_useful_data[0]:
                    split = metric.split(") ")
                    if len(split) > 2:
                        no, met = split[0], split[2]
                    else:
                        no, met = split[0], split[1]
                    if no == metric_no:
                        info.append(met)
                        break
                
                # Finding the key of the data_standardized associated with the metric
                data_no = ""
                for data_metric_link in data_metric_links:
                    no, dta = data_metric_link
                    if no == metric_no:
                        data_no = dta

                # Grabbing the data_standardized that we want
                for datum in paper_useful_data[1]:
                    no, d = datum.split(") ")
                    if no == data_no:
                        info.append(d)
                        break

                # Find the correct outcomes
                for small_outcome in paper_useful_data[2]:
                    no, out = small_outcome.split(") ")
                    if no == outcome_let:
                        info.append(out)
                        break
                for large_outcome in paper_useful_data[3]:
                    no, out = large_outcome.split(") ")
                    if no == outcome_let:
                        info.append(out)
                        break
                info_list.append(info)
            return info_list
            
        info_list = build_info(paper_useful_data, metric_category_pairs, data_metric_links)
        if paper == 4:
            print(info_list)


        def build_data(pos, info):
            if not info:
                update = False
                if pos:
                    for i in range(len(pos)):
                        # print(pos[i])
                        if pos[i]["name"] == data[paper]["title"]:
                            pos[i]["value"] += 1
                            update =  True
                            break
                if not update:
                    pos.append({"name": data[paper]["title"], "value": 1, "id": data[paper]["paper_id_new"]})
                return
            category = info.pop()
            if not pos:
                pos.append({"name": category, "children": []})
                # Recursively call to fill the new children array we created with the next feature
                build_data(pos[0]["children"], info)
            else:
                # Otherwise check if the feature is already there.
                found = False
                for i in range(len(pos)):
                    # If so, we will build the next node there
                    if pos[i]["name"] == category:
                        build_data(pos[i]["children"], info)
                        found = True
                # Else we must again add the feature with empty children and continue at the next level
                if not found:
                    pos.append({"name": category, "children": []})
                    build_data(pos[-1]["children"], info)

        for info in info_list:
            build_data(pos, info)

        # Recursive function to generate children for each paper
        # def build_data(pos, hierarchy_list):
        #     # If at end of the hierarchy, we add a point corresponding to the paper in the position
        #     if not(hierarchy_list):
        #         update = False
        #         if pos:
        #             for i in range(len(pos)):
        #                 # print(pos[i])
        #                 if pos[i]["name"] == data[paper]["title"]:
        #                     pos[i]["value"] += 1
        #                     update =  True
        #                     break
        #         if not update:
        #             pos.append({"name": data[paper]["title"], "value": 1, "id": data[paper]["paper_id_new"]})
        #         return
        #     # Else we pop what category we are considering
        #     category = hierarchy_list.pop()
            
        #     for feature in data[paper][category]:
        #         clean_feature = feature.split(") ")[1]
        #         # If pos currently is an empty children list, we add the feature!
        #         if not pos:
        #             pos.append({"name": clean_feature, "children": []})
        #             # Recursively call to fill the new children array we created with the next feature
        #             build_data(pos[0]["children"], hierarchy_list)
        #         else:
        #             # Otherwise check if the feature is already there.
        #             found = False
        #             for i in range(len(pos)):
        #                 # If so, we will build the next node there
        #                 if pos[i]["name"] == clean_feature:
        #                     build_data(pos[i]["children"], hierarchy_list)
        #                     found = True
        #             # Else we must again add the feature with empty children and continue at the next level
        #             if not found:
        #                 pos.append({"name": clean_feature, "children": []})
        #                 build_data(pos[-1]["children"], hierarchy_list)
        #     hierarchy_list.append(category)
        #     return
        
        # build_data(pos, FIELD_HIERARHCY.copy())
    
    # Dump JSON to output file
    with open(OUTPUT_PATH, "w") as output_file:
        output_file.seek(0)
        json.dump(new_data, output_file, indent=4)
        output_file.truncate()

