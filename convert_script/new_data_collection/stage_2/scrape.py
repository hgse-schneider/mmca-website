'''
need to install
pip install BeautifulSoup4
pip install lxml
pip install requests
'''

from bs4 import BeautifulSoup
import requests
import pandas as pd
import time
import random
headers = {"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36" ,'referer':'https://www.google.com/'}

INPUT_PATH = "data.JSON"
OUTPUT_PATH = "citation_data.JSON"

GSCHOLAR_PREFIX = "https://scholar.google.com/scholar?hl=en&as_sdt=0%2C22&q="
GSCHOLAR_SUFFIX = "&btnG="

def genereate_gscholar_link(paper_name):
	replaced = paper_name.replace(" ", "+")
	return GSCHOLAR_PREFIX + replaced + GSCHOLAR_SUFFIX

with open(INPUT_PATH, 'r') as f:
	data = pd.read_json(INPUT_PATH)
	print(data.shape)
	
	urls = []
	citations = []
	for paper in data:
		title = data[paper]["title"]
		url = genereate_gscholar_link(title)
		urls.append(url)
		response=requests.get(url=url,headers=headers)
		soup=BeautifulSoup(response.content,'lxml')
		if not soup.select('[data-lid]'):
			print(f"WARNING: SCRAPE PROBLEM on paper {paper} (according to JSON file number)")
			citations.append(-1)
		item = soup.select('[data-lid]')[0]
			# for this search .gs_fl appears twice. It appears on every result for the citations etc,
			# but randomly on other ones which have PDFs or HTML files attached too, so can be up to 21 occurrences for 10 search results
			# Provided search always returns exactly 1 result this will always pull the right result
		try:
			# print(f"Paper: {title}")
			citation_info = item.select('.gs_fl')[1].select('a')[2].get_text()
			# Checking for errors in pulling data from gscholar
			if citation_info:
				print(citation_info)
				citations.append(citation_info.split()[2])
			else:
				print("Problem 1")
				citations.append(0)
		# Just in case things break 
		except:
			citations.append(-1)
			print(f'Problem 2, paper: {paper}')
		# Random amount of time before queries to play nice with google scholar rules
		time.sleep(50 + random.random()*20)
	
	# Backup in case things break to add values manually for testing
	# citations = [ 0 for _ in range(75)]
	# urls = urls + [0 for _ in range(74)]

	data = data.transpose()
	data.insert(len(data.columns), "Citations", citations)
	data.insert(len(data.columns), "google_scholar_url", urls[0:75])
	data = data.transpose()
	data.to_json(OUTPUT_PATH)