'''
Used to remove papers from citation_data before running reformat_data.py

Just to speed up my testing to quickly remove papers that currently have coding issues
'''

import pandas as pd
import json
import re
import logging
import sys
from textwrap import dedent

CODING_ISSUES = [82, 83, 84, 88, 99, 122, 128, 133, 151]

INPUT_PATH = "citation_data.JSON"
OUTPUT_PATH = "citation_data_reduced.JSON"

with open(INPUT_PATH, 'r') as f:
    data = pd.read_json(INPUT_PATH)
    print(data.shape)
    for paper in data:
        if data[paper]["paper_id_new"] in CODING_ISSUES:
            data.drop(paper, axis=1, inplace=True)
    data.to_json(OUTPUT_PATH)
