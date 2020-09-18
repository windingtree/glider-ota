import React from 'react';
import TripDetails, {ItineraryDetails,SegmentDetails,RouteOverview,LayoverInfo} from "./trip-details"

export default {
  title: 'Flights/Segment, Itinerary and Trip details',
};

let segments=[{
  "operator": {
    "operatorType": "airline",
    "iataCode": "AC",
    "flightNumber": "AC0460",
    "airline_name": "Air Canada"
  },
  "origin": {
    "locationType": "airport",
    "iataCode": "YYZ",
    "city_name": "Toronto",
    "airport_name": "Lester B. Pearson Intl"
  },
  "destination": {
    "locationType": "airport",
    "iataCode": "CDG",
    "city_name": "Paris",
    "airport_name": "Charles de Gaulle"
  },
  "departureTime": "2020-07-11T21:10:00.000Z",
  "arrivalTime": "2020-07-11T22:12:00.000Z"
},
  {
    "operator": {
      "operatorType": "airline",
      "iataCode": "AC",
      "flightNumber": "AC0460",
      "airline_name": "Air Canada"
    },
    "origin": {
      "locationType": "airport",
      "iataCode": "CDG",
      "city_name": "Paris",
      "airport_name": "Charles de Gaulle"
    },
    "destination": {
      "locationType": "airport",
      "iataCode": "YUL",
      "city_name": "Montreal",
      "airport_name": "Pierre E.Trudeau Intl"
    },
    "departureTime": "2020-07-11T22:40:00.000Z",
    "arrivalTime": "2020-07-11T23:25:00.000Z"
  },
  {
    "operator": {
      "operatorType": "airline",
      "iataCode": "AC",
      "flightNumber": "AC0460",
      "airline_name": "Air Canada"
    },
    "origin": {
      "locationType": "airport",
      "iataCode": "ORY",
      "city_name": "Paris",
      "airport_name": "Orly"
    },
    "destination": {
      "locationType": "airport",
      "iataCode": "YUL",
      "city_name": "Montreal",
      "airport_name": "Pierre E.Trudeau Intl"
    },
    "departureTime": "2020-07-11T22:40:00.000Z",
    "arrivalTime": "2020-07-11T23:25:00.000Z"
  }];


const itinerary1 = {
  "itinId": "FL9",
  "segments": [
    {
      "operator": {
        "operatorType": "airline",
        "iataCode": "VY",
        "carrier_name":"Vueling",
        "flight_number":"VY-8783",
        "flight_info":"Boeing 737",
      },
      "origin": {
        "locationType": "airport",
        "iataCode": "DME",
        "airport_name":"Moscow Domodedovo Airport",
        "city_name": "moscow",
      },
      "departureTime": "2020-07-14T17:50:00.000Z",
      "destination": {
        "locationType": "airport",
        "iataCode": "DOH",
        "airport_name":"Doha Hamad International Airport",
        "city_name": "Doha",
      },
      "arrivalTime": "2020-07-15T07:30:00.000Z"
    },
    {
      "operator": {
        "operatorType": "airline",
        "iataCode": "AF"
      },
      "origin": {
        "locationType": "airport",
        "iataCode": "CDG",
        "city_name": "Paris",
      },
      "departureTime": "2020-07-15T15:35:00.000Z",
      "destination": {
        "locationType": "airport",
        "iataCode": "HKG",
        "city_name": "Hongkong",
      },
      "arrivalTime": "2020-07-16T09:35:00.000Z"
    }
  ]
}

const itinerary2 = {
  "itinId": "FL19",
  "segments": [
    {
      "operator": {
        "operatorType": "airline",
        "iataCode": "AF"
      },
      "origin": {
        "locationType": "airport",
        "iataCode": "HKG"
      },
      "departureTime": "2020-07-21T20:50:00.000Z",
      "destination": {
        "locationType": "airport",
        "iataCode": "CDG"
      },
      "arrivalTime": "2020-07-22T03:55:00.000Z"
    },
    {
      "operator": {
        "operatorType": "airline",
        "iataCode": "KL"
      },
      "origin": {
        "locationType": "airport",
        "iataCode": "CDG"
      },
      "departureTime": "2020-07-22T06:40:00.000Z",
      "destination": {
        "locationType": "airport",
        "iataCode": "AMS"
      },
      "arrivalTime": "2020-07-22T08:00:00.000Z"
    },
    {
      "operator": {
        "operatorType": "airline",
        "iataCode": "DL"
      },
      "origin": {
        "locationType": "airport",
        "iataCode": "AMS"
      },
      "departureTime": "2020-07-22T16:00:00.000Z",
      "destination": {
        "locationType": "airport",
        "iataCode": "JFK"
      },
      "arrivalTime": "2020-07-22T18:26:00.000Z"
    }
  ]
}



const roundtrip = [itinerary1,itinerary2];

export const singleSegmentDetails = () => (<SegmentDetails segment={segments[0]}/>);
export const itineraryDetails = () => (<ItineraryDetails itinerary={itinerary1}/>);
export const tripOverview = () => (<RouteOverview itineraries={roundtrip}/>);
export const tripDetails = () => (<TripDetails itineraries={roundtrip}/>);
export const transferInfo = () => (<LayoverInfo prevSegment={segments[0]}  nextSegment={segments[1]}/>);
export const transferInfoWithAirportChange = () => (<LayoverInfo prevSegment={segments[0]}  nextSegment={segments[2]}/>);
