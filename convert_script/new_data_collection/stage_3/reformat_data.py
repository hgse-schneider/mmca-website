import pandas as pd
import json
import re
import logging
import sys
from textwrap import dedent

'''
Guidance:
This script is designed to take the overall JSON data file created using data_collection.py
and refactor it into another JSON format to work well for the circular_packing plot.

Now with citation data, it should take the data WITH citation data from STAGE_2 to ensure the final result has that data.
If you don't need the citation data, you can just use STAGE_1 and STAGE_3.

How-to:
You can run this file using:
$ py reformat_data.py

You should ensure all parameters specified below are set to your desire before doing so.

YOU MUST CHECK THE ERROR LOG FILE AFTER RUNNING TO SAVE YOURSELF A LOT OF PAIN LATER. I have done my best
to set up some error logging work for you so that it should give you useful infomartion on issues that you can hunt.

Parameters:
--> INPUT_PATH: location of input data (must end .JSON)
--> OUTPUT_PATH: desired location/name of output data (must end .JSON)
--> FIELD_HIERARCHY: order of fields in diagram, first element highest
'''

INPUT_PATH = "citation_data_reduced.JSON"
OUTPUT_PATH = "circle_data_test.JSON"

# Flipping hierarhcy order from the intuitive since pop removes from end
FIELD_HIERARHCY = ["outcome_larger_category", "outcome_smaller_category", "data", "metric"][::-1]

# Setting up an error log for you. 
logging.basicConfig(filename='error_log.txt', encoding='utf-8', level=logging.DEBUG, filemode="w")

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
                    err = dedent(f"""
                                    ERROR for paper_id_new {data[paper]['paper_id_new']}: 
                                    Check formatting of analysis, should have form aa: bb: cc""")
                    print(err)
                    logging.error(err)
                    sys.exit(1)
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
            return list(links)

        metric_category_pairs = pair_metric_and_category(paper)
        data_metric_links = pair_data_and_metric(paper)
        paper_useful_data = [data[paper][category] for category in FIELD_HIERARHCY]

        def warn(paper, field):
            logging.warning(dedent(f"""
                                    Paper with paper_id_new: {data[paper]['paper_id_new']} 
                                    has incorrect length info, missing field: {field} """))

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
                        no, met = split[0], split[2].lower().strip()
                    else:
                        if len(split) == 1:
                            print(paper)
                            print(split)
                        no, met = split[0], split[1].lower().strip()
                        
                    if no == metric_no:
                        info.append(met)
                        break
                
                if len(info) != 1:
                    warn(paper, FIELD_HIERARHCY[0])

                # Finding the key of the data associated with the metric
                data_no = ""
                for data_metric_link in data_metric_links:
                    no, dta = data_metric_link
                    dta = dta.lower().strip()
                    if no == metric_no:
                        data_no = dta

                # Grabbing the data that we want
                for datum in paper_useful_data[1]:
                    try:
                        no, d = datum.split(") ")
                        d = d.lower().strip()
                    except:
                        err = f"Problem with paper_id_new: {data[paper]['paper_id_new']} for field {FIELD_HIERARHCY[1]}:"
                        print(err)
                        print(paper_useful_data[1])
                        logging.warning(err)
                        logging.warning(str(paper_useful_data[1]) + "\n")
                        print(" ")
                    if no == data_no:
                        info.append(d)
                        break

                if len(info) != 2:
                    warn(paper, FIELD_HIERARHCY[1])

                # Find the correct outcomes
                for small_outcome in paper_useful_data[2]:
                    try:
                        no, out = small_outcome.split(") ")
                        out = out.lower().strip()
                    except Exception as e:
                        err = f"Problem with paper_id_new: {data[paper]['paper_id_new']} for field {FIELD_HIERARHCY[2]}: "
                        print(err)
                        print(paper_useful_data[2])
                        print(" ")
                        logging.warning(err)
                        logging.warning(str(paper_useful_data[2]) + "\n")

                    if no == outcome_let:
                        info.append(out)
                        break
                
                if len(info) != 3:
                    warn(paper, FIELD_HIERARHCY[2])        

                for large_outcome in paper_useful_data[3]:
                    no, out = large_outcome.split(") ")
                    out = out.lower().strip()
                    if no == outcome_let:
                        info.append(out)
                        break
                
                if len(info) != 4:
                    warn(paper, FIELD_HIERARHCY[3])

                info_list.append(info)
            return info_list
            
        info_list = build_info(paper_useful_data, metric_category_pairs, data_metric_links)
        
        for info in info_list:
            if len(info) != 4:
                logging.warning(dedent(f"""
                                            Paper with paper_id_new: {data[paper]['paper_id_new']} 
                                            has incorrect length info (Normally caused by codes such as II not matching up) """))

        def build_data(pos, info):
            if not info:
                update = False
                if pos:
                    for i in range(len(pos)):
                        # print(pos[i])
                        if pos[i]["name"] == data[paper]["title"]:
                            # Value and connections are initialized to be the same
                            # Visualizations use value, but we store connections as
                            # we will switch what it uses for value, but viz default to connections
                            pos[i]["value"] += 1
                            pos[i]["connections"] = pos[i]["value"]
                            update =  True
                            break
                if not update:
                    pos.append({"name": data[paper]["title"], 
                                "value": 1, 
                                "connections": 1,
                                "id": data[paper]["paper_id_new"],
                                "citations": data[paper]["Citations"],
                                "year": data[paper]["year"],
                                "url": data[paper]["google_scholar_url"],
                                "metric": data[paper]["metric"],
                                "outcome": data[paper]["outcome"]
                                })
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
    
    # Dump JSON to output file
    with open(OUTPUT_PATH, "w") as output_file:
        output_file.seek(0)
        json.dump(new_data, output_file, indent=4)
        output_file.truncate()

