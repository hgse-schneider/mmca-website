# Instructions for all data collection scripts

## Stage 1
Stage 1 is converting the CSV files from the Excel spreadsheets to an JSON file, `data.JSON`.

This requires the two CSV files for the tabs `paper_meta.csv` and `paper_metrics_constructs.csv` to be placed into the folder, and to update the parameters in the `data_collection.py` script.

## Stage 2
Stage 2 takes that data as `data.JSON` and adds the citation data into it using a web-scraper. Note that this step will take roughly $70s \times \text{number of papers}$ as otherwise Google Scholar's bot protection blocks the web scraper. With this in mind, you should **always CHECK the output file** `citation_data.JSON` to ensure it gathered correct data. It will place $-1$ as the number of citations for any paper where it encounters an error. Currently this requires manually clicking the URL and collecting that data - last time this required me to enter about 6 manually out of 74, I will try to fix this to become entirely automatic, but for the moment heed this warning

## Stage 3
Stage 3 then takes that citation data (which currently needs to be verified) and converts that into the format used by the circular packing and tree diagrams. It is currently configured to take `citation_data_verified.JSON` (manually created from `citation_data.JSON`) and outputs `circle_data_new.JSON`.