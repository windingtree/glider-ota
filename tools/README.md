# Introduction
Glider OTA (backend and frontend) needs to store multiple types of dictionary data.

Type of dictionary data:
* list of airports (flight search lookup field, search results enrichment)
* list of currencies (needed for correct payment processing - conversion of monetary units)
* list of cities (hotel search lookup)
* list of countries (search results enrichment)
* list of airlines (search results enrichment)

This data is not maintained by Glider OTA, it is sources from multiple locations (open source).
It's format however and storage is custom to Glider OTA.
Therefore data needs to be generated to Glider OTA format.

## Data sources

List of airports
* https://github.com/opentraveldata/opentraveldata/tree/master/data/IATA

List of currencies 
* https://www.currency-iso.org/en/home/tables/table-a1.html

List of cities (with population over 15000 is used but can be custom)
* https://download.geonames.org/export/dump/

List of airlines (only airlines that operate currently will be used)
* https://github.com/opentraveldata/opentraveldata/blob/master/opentraveldata/optd_airline_best_known_so_far.csv

## Dictionary data maintenance
Dictionary data is considered static however there may be times when it has to be updated.
This document explain steps needed to re-generate all dictionary data.

### Step 1 - Download necessary data 

#### Currency codes 
* Download currencies from https://www.currency-iso.org/dam/downloads/lists/list_one.xls
* Reformat file to have the following columns only: code,minor unit, currency name,entity 
* Save it as CSV file (first row = headers) as /tools/dictionary/input/currencies.csv

#### City details
* Download list of cities (cities with population over 15000) from https://download.geonames.org/export/dump/cities15000.zip
* Unzip and save as /tools/dictionary/input/cities.txt

#### Country details
* Download list of countries from https://download.geonames.org/export/dump/countryInfo.txt
* Save it as /tools/dictionary/input/countries.txt

#### Airports
* Download list of airports from https://github.com/opentraveldata/opentraveldata/blob/master/data/IATA/iata_airport_list_latest.csv 
* Save it as /tools/dictionary/input/airports.csv

#### Airlines
* Download list of airlines from https://github.com/opentraveldata/opentraveldata/blob/master/opentraveldata/optd_airline_best_known_so_far.csv 
* Save it as /tools/dictionary/input/airlines.csv


### Step 2 - Process downloaded data 

* remove contents of folder /tools/dictionary/output
* execute script /tools/dictionary/process_dictionary_data.js
* you should have new files in /tools/dictionary/output folder

### Step 3 - Copy to a dedicated folder 

* copy contents of /tools/dictionary/output folder into /api/_data
