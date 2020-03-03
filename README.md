# ota
OTA monorepo


## Start
* npm install
* npm start
* now dev


##List of airports
List of airports that is used in origin/destination lookup fields is taken from IATA list
* https://github.com/opentraveldata/opentraveldata/tree/master/data/IATA

It's curated with a script that transforms data to JSON format and filters out unwanted types

```bash
    /tools/airports/iata_airports_converter.js
```
Original list contains not only airports but also heliports, railstations, ferry ports.
Unwanted locations can be filtered out 