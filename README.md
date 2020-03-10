# ota
OTA monorepo


## Start
* npm install
* npm start
* now dev


#### List of airports
List of airports that is used in origin/destination lookup fields is taken from IATA list
* https://github.com/opentraveldata/opentraveldata/tree/master/data/IATA

It's curated with a script that transforms data to JSON format and filters out unwanted types

```bash
    /tools/airports/airports.js
```
Original list contains not only airports but also heliports, railstations, ferry ports.
Unwanted locations can be filtered out



#### List of locations
List of locations that is used in hotels lookup fields is taken from geonames.org list of cities
* https://download.geonames.org/export/dump/

It's also curated with a script that transforms data to JSON format and filters out unwanted cities (currently cities with population over 300000 are taken into account)

```bash
    /tools/airports/locations.js
```
