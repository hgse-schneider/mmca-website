import pandas as pd
import sys

INPUT_PATH = "data.JSON"
OUTPUT_PATH = "citation_data.JSON"
BACKUP_PATH = "store.txt"

GSCHOLAR_PREFIX = "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C22&q="
GSCHOLAR_SUFFIX = "&btnG="

def genereate_gscholar_link(paper_name):
	replaced = paper_name.replace(" ", "+")
	return GSCHOLAR_PREFIX + replaced + GSCHOLAR_SUFFIX

with open(INPUT_PATH, 'r') as f:
    data = pd.read_json(INPUT_PATH)
    print(data.shape)
    
    urls = []
    for paper in data:
        title = data[paper]["title"]
        url = genereate_gscholar_link(title)
        urls.append(url)

    with open(BACKUP_PATH, "r") as backup:
        citations = backup.readlines()
        try:
            citations = list(map(lambda x: int(x), citations))
        except Exception as e:
            print(f"Encountered error: {e}")
            print("Generally indicates that file needs to be cleaned")
            print("Should be a file of just numbers, with each paper's citation count on its own line")
            sys.exit(1)

    data = data.transpose()
    data.insert(len(data.columns), "Citations", citations)
    data.insert(len(data.columns), "google_scholar_url", urls)
    data = data.transpose()
    data.to_json(OUTPUT_PATH)