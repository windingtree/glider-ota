## Initial data needed by Glider OTA
This folder contains data that has to be loaded into Mongo database:
* List of airports
* List of cities

This data is needed to support airport or city lookup when user starts searching for airport or city in the UI
List of airports and cities has a pagerank value which is used to order matching results (high rank = high position in the results)

#### list of airports
You must load 'airports.json' file to your mongo database, to a collection called 'airports'

#### list of cities
You must load 'cities.json' file to your mongo database, to a collection called 'cities'
