import React from 'react';
import {
    action
} from '@storybook/addon-actions';
import {ShoppingCart} from './shopping-cart'

export default {
    title: 'shopping cart',
    component: ShoppingCart
};

const sampleCart = {
    flightOffer: {
            offer: {
                expiration: '2020-12-09T10:22:34.642Z',
                pricePlansReferences: {
                    'eed941bb-0565-41fa-8fe3-415f8f7a77c6-BG': {
                        flights: [
                            'aa7dd292-4888-4e95-8f53-722b276cc4bd',
                            '9e56e4a2-d79b-45dc-9111-91f3adf1eb4f'
                        ]
                    }
                },
                price: {
                    currency: 'EUR',
                    'public': 268.53,
                    commission: '0.00',
                    taxes: '0.00'
                },
                offerId: '42ad23de-fdf5-4bf2-8d85-9c6ad7f3539e'
            },
            itineraries: [
                {
                    itinId: 'aa7dd292-4888-4e95-8f53-722b276cc4bd',
                    segments: [
                        {
                            operator: {
                                operatorType: 'airline',
                                iataCode: 'AM',
                                iataCodeM: 'AM',
                                flightNumber: '709',
                                airline_name: 'AeroMexico'
                            },
                            origin: {
                                locationType: 'airport',
                                iataCode: 'BOG',
                                city_name: 'Bogota',
                                airport_name: 'El Dorado Intl'
                            },
                            destination: {
                                locationType: 'airport',
                                iataCode: 'MEX',
                                city_name: 'Mexico City',
                                airport_name: 'Metropolitan Area'
                            },
                            departureTime: '2021-02-17T01:47:00.000Z',
                            arrivalTime: '2021-02-17T05:45:00.000Z',
                            departureTimeUtc: '2021-02-17T06:47:00.000Z',
                            arrivalTimeUtc: '2021-02-17T11:45:00.000Z',
                            segmentId: '16'
                        },
                        {
                            operator: {
                                operatorType: 'airline',
                                iataCode: 'AM',
                                iataCodeM: 'AM',
                                flightNumber: '422',
                                airline_name: 'AeroMexico'
                            },
                            origin: {
                                locationType: 'airport',
                                iataCode: 'MEX',
                                city_name: 'Mexico City',
                                airport_name: 'Metropolitan Area'
                            },
                            destination: {
                                locationType: 'airport',
                                iataCode: 'MIA',
                                city_name: 'Miami',
                                airport_name: 'Metropolitan Area'
                            },
                            departureTime: '2021-02-17T12:20:00.000Z',
                            arrivalTime: '2021-02-17T16:20:00.000Z',
                            departureTimeUtc: '2021-02-17T18:20:00.000Z',
                            arrivalTimeUtc: '2021-02-17T21:20:00.000Z',
                            segmentId: '17'
                        }
                    ],
                    filter_metadata: {
                        itinerary_duration: 873,
                        stops: 1,
                        operating_carriers: {
                            AM: 'AM'
                        }
                    }
                },
                {
                    itinId: '9e56e4a2-d79b-45dc-9111-91f3adf1eb4f',
                    segments: [
                        {
                            operator: {
                                operatorType: 'airline',
                                iataCode: 'AM',
                                iataCodeM: 'AM',
                                flightNumber: '423',
                                airline_name: 'AeroMexico'
                            },
                            origin: {
                                locationType: 'airport',
                                iataCode: 'MIA',
                                city_name: 'Miami',
                                airport_name: 'Metropolitan Area'
                            },
                            destination: {
                                locationType: 'airport',
                                iataCode: 'MEX',
                                city_name: 'Mexico City',
                                airport_name: 'Metropolitan Area'
                            },
                            departureTime: '2021-02-24T12:57:00.000Z',
                            arrivalTime: '2021-02-24T15:40:00.000Z',
                            departureTimeUtc: '2021-02-24T17:57:00.000Z',
                            arrivalTimeUtc: '2021-02-24T21:40:00.000Z',
                            segmentId: '36'
                        },
                        {
                            operator: {
                                operatorType: 'airline',
                                iataCode: 'AM',
                                iataCodeM: 'AM',
                                flightNumber: '708',
                                airline_name: 'AeroMexico'
                            },
                            origin: {
                                locationType: 'airport',
                                iataCode: 'MEX',
                                city_name: 'Mexico City',
                                airport_name: 'Metropolitan Area'
                            },
                            destination: {
                                locationType: 'airport',
                                iataCode: 'BOG',
                                city_name: 'Bogota',
                                airport_name: 'El Dorado Intl'
                            },
                            departureTime: '2021-02-24T18:45:00.000Z',
                            arrivalTime: '2021-02-25T00:19:00.000Z',
                            departureTimeUtc: '2021-02-25T00:45:00.000Z',
                            arrivalTimeUtc: '2021-02-25T05:19:00.000Z',
                            segmentId: '37'
                        }
                    ],
                    filter_metadata: {
                        itinerary_duration: 682,
                        stops: 1,
                        operating_carriers: {
                            AM: 'AM'
                        }
                    }
                }
            ],
            price: {
                currency: 'EUR',
                'public': 268.53,
                commission: '0.00',
                taxes: '0.00'
            },
            offerId: '42ad23de-fdf5-4bf2-8d85-9c6ad7f3539e'
        },
    hotelOffer: {
        "offerId": "323a28d9-fd99-40bc-8efc-c18e32980c86",
        "price": {
            "currency": "EUR",
            "public": 171.93,
            "taxes": 0
        },
        "room": {
            "name": "Standard Room",
            "description": "Our standard double rooms (from 19 sqm) feature a double bed (160cm) or two single beds (2x105cm).",
            "amenities": [],
            "size": {
                "value": "19",
                "_unit_": "Sq.M."
            },
            "maximumOccupancy": {
                "adults": "2",
                "childs": "1"
            },
            "media": [
                {
                    "type": "photo",
                    "width": "1024",
                    "height": "683",
                    "url": "https://s3.amazonaws.com/images.hotels/images/04393/37227/Standard1.jpg"
                },
                {
                    "type": "photo",
                    "width": "1024",
                    "height": "682",
                    "url": "https://s3.amazonaws.com/images.hotels/images/04393/37227/Standard2.jpg"
                },
                {
                    "type": "photo",
                    "width": "1024",
                    "height": "655",
                    "url": "https://s3.amazonaws.com/images.hotels/images/04393/37227/Standard3.jpg"
                }
            ],
            "policies": {
                "smoking_policy": "non-Smoking",
                "accessibility_policy": "Accessible rooms provided on request subject to availability"
            }
        },
        "hotel": {
            "name": "Clarion Hotel The Hub",
            "type": "hotel",
            "description": "Clarion Hotel The Hub offers an organic breakfast buffet, free WiFi and free sauna, steam bath and swimming pool access. Clarion Hotel The Hub is a certified environmental-friendly hotel with its own urban garden Grow Hub. All rooms have air-conditioning, cable TV and a tea/coffee maker. Scandinavian inspired dishes and sustainable food can be enjoyed under the high glass roof of the à la carte Restaurant Norda on the top floor, with a concept by the famed chef Marcus Samuelsson. In summer, the terrace is a nice place for afternoon coffee or evening cocktails. Clarion Hotel The Hub has 24 meeting rooms with a capacity of up to 1850 people, including 10 boardrooms and a VIP room of 80 square metres. A 180 square metres gym is also available.",
            "location": {
                "coordinates": {
                    "latitude": "59.91207189",
                    "longitude": "10.75123385"
                }
            },
            "rating": "4",
            "contactInformation": {
                "phoneNumbers": [
                    "47 47 950 65 554"
                ],
                "emails": [
                    "cl.thehub@choice.no"
                ],
                "address": {
                    "streetAddress": "Biskop Gunnerus Gate 3",
                    "premise": "Karl Johans Gate",
                    "locality": "Oslo",
                    "postalCode": "0155",
                    "country": "NO"
                }
            },
            "checkinoutPolicy": {
                "checkinTime": "15:00",
                "checkoutTime": "24:00"
            },
            "otherPolicies": {
                "Legal": "",
                "child_policy": "Children of any age are welcome. Children aged 18 years and above are considered adults at this property.",
                "Others Not Allowed": "Guests are required to show a photo identification and credit card upon check-in. Please note that all Special Requests are subject to availability and additional charges may apply.",
                "Terms & Condition": "Guests are required to show a photo identification and credit card upon check-in. Please note that all Special Requests are subject to availability and additional charges may apply.",
                "smoking_policy": "Non smoking throughout.",
                "parking_shuttle": "NOnsite free parking.",
                "pet_policy": "Pets not allowed."
            },
            "media": [
                {
                    "type": "photo",
                    "width": "1024",
                    "height": "564",
                    "url": "https://s3.amazonaws.com/images.hotels/images/04393/ClarionHotelTheHub1.jpg"
                },
                {
                    "type": "photo",
                    "width": "1024",
                    "height": "667",
                    "url": "https://s3.amazonaws.com/images.hotels/images/04393/ClarionHotelTheHub2.jpg"
                },
                {
                    "type": "photo",
                    "width": "1024",
                    "height": "683",
                    "url": "https://s3.amazonaws.com/images.hotels/images/04393/ClarionHotelTheHub3.jpg"
                },
                {
                    "type": "photo",
                    "width": "1024",
                    "height": "683",
                    "url": "https://s3.amazonaws.com/images.hotels/images/04393/ClarionHotelTheHub4.jpg"
                }
            ],
            "roomTypes": {
                "ND": {
                    "name": "Standard Room",
                    "description": "Our standard double rooms (from 19 sqm) feature a double bed (160cm) or two single beds (2x105cm).",
                    "amenities": [],
                    "size": {
                        "value": "19",
                        "_unit_": "Sq.M."
                    },
                    "maximumOccupancy": {
                        "adults": "2",
                        "childs": "1"
                    },
                    "media": [
                        {
                            "type": "photo",
                            "width": "1024",
                            "height": "683",
                            "url": "https://s3.amazonaws.com/images.hotels/images/04393/37227/Standard1.jpg"
                        },
                        {
                            "type": "photo",
                            "width": "1024",
                            "height": "682",
                            "url": "https://s3.amazonaws.com/images.hotels/images/04393/37227/Standard2.jpg"
                        },
                        {
                            "type": "photo",
                            "width": "1024",
                            "height": "655",
                            "url": "https://s3.amazonaws.com/images.hotels/images/04393/37227/Standard3.jpg"
                        }
                    ],
                    "policies": {
                        "smoking_policy": "non-Smoking",
                        "accessibility_policy": "Accessible rooms provided on request subject to availability"
                    }
                },
                "ND1": {
                    "name": "Superior  Room",
                    "description": "Our superior double rooms are nice and spacious and feature a double bed (160cm) with luxury duvets and pillows.",
                    "amenities": [
                        "Newspaper"
                    ],
                    "size": {
                        "value": "24",
                        "_unit_": "Sq.M."
                    },
                    "maximumOccupancy": {
                        "adults": "2",
                        "childs": "1"
                    },
                    "media": [],
                    "policies": {
                        "smoking_policy": "non-Smoking",
                        "accessibility_policy": "Accessible rooms provided on request subject to availability"
                    }
                }
            },
            "accommodationId": "EREVMAX.04393"
        }
    },
    error: null
}


export const EmptyCart = () => (<ShoppingCart onBook={action('onBook')}/>);
export const FlightOnly = () => (<ShoppingCart flightOffer={sampleCart.flightOffer} onBook={action('onBook')}/>);
export const HotelOnly = () => (<ShoppingCart hotelOffer={sampleCart.hotelOffer} onBook={action('onBook')}/>);
export const HotelAndFlight = () => (
    <ShoppingCart 
        hotelOffer={sampleCart.hotelOffer}
        flightOffer={sampleCart.flightOffer}
        onBook={action('onBook')}
        totalPrice={{public: 23445.23, currency:'EUR'}}
    />);
