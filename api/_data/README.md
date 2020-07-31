# Introduction
Files in this folder are considered a static data. 
This data is required at multiple stages and are crucial for Glider OTA.
 
##List of files

* airlines.json
    * list of all available airlines 
    * It is used to resolve airline name based on IATA code (and display airline name in search results))
* airports.json
    * list of all airports and metropolitan areas
    * It's used in airports name lookup field(flights search), when user enters airport name in the UI
    * It's also used to resolve full airport name based on IATA code (and display full airport name in search results)
     
* cities.json 
    * list of cities and locations
    * It's used in city name lookup (hotel search), when user enters city name in the UI)
    
* countries.json
    * list of countries ('country code' to 'country name' map)
    
* currencies.json
    * list of currency codes, names and it's precision digits (aka 'minor units') 
    * it's used in payment (stripe) to calculate amount that needs to be charged in minor units (e.g. 10,65EUR = 1065 in minor units)

