import React from 'react';
import {
  action
} from '@storybook/addon-actions';

import TripDetails, {ItineraryDetails,SegmentDetails} from "./trip-details"

export default {
  title: 'Segment, Itinerary and Trip details',
};
const segment1={
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
    "airport_name":"Moscow Domodedovo Airport"
  },
  "departureTime": "2020-07-14T17:50:00.000Z",
  "destination": {
    "locationType": "airport",
    "iataCode": "DOH",
    "airport_name":"Doha Hamad International Airport"
  },
  "arrivalTime": "2020-07-15T07:30:00.000Z"
}

const segment2={
  "operator": {
    "operatorType": "airline",
    "iataCode": "AF"
  },
  "origin": {
    "locationType": "airport",
    "iataCode": "CDG"
  },
  "departureTime": "2020-07-15T15:35:00.000Z",
  "destination": {
    "locationType": "airport",
    "iataCode": "HKG"
  },
  "arrivalTime": "2020-07-16T09:35:00.000Z"
}



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
        "airport_name":"Moscow Domodedovo Airport"
      },
      "departureTime": "2020-07-14T17:50:00.000Z",
      "destination": {
        "locationType": "airport",
        "iataCode": "DOH",
        "airport_name":"Doha Hamad International Airport"
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
        "iataCode": "CDG"
      },
      "departureTime": "2020-07-15T15:35:00.000Z",
      "destination": {
        "locationType": "airport",
        "iataCode": "HKG"
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


const price = {
  "currency": "EUR",
      "public": "1410.77",
      "commission": "8.21",
      "taxes": "589.77"
}

const roundtrip = [itinerary1,itinerary2];

export const singleSegmentDetails = () => (<SegmentDetails segment={segment1}/>);
export const itineraryDetails = () => (<ItineraryDetails itinerary={itinerary1}/>);
export const tripDetails = () => (<TripDetails itineraries={roundtrip}/>);
