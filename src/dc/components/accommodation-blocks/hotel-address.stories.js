import React from 'react';
import {HotelAddress} from "./hotel-address"

export default {
    title: 'DC/accommodation blocks/hotel address',
    component: HotelAddress
};

let addressAmadeus = {
    "streetAddress": "VASTRA TRADGARDSGATAN 11B",
    "locality": "STOCKHOLM",
    "postalCode": "111 53",
    "country": "SE"
}

let addressERevMax = {
    "streetAddress": "Kungsbron 1",
    "premise": "WTC",
    "locality": "Stockholm",
    "postalCode": "111 22",
    "country": "SE"
}

export const AddressFromAmadeusGds = () => (
    <HotelAddress country={addressAmadeus.country} locality={addressAmadeus.locality} postalCode={addressAmadeus.postalCode}
                  premise={addressAmadeus.premise} streetAddress={addressAmadeus.streetAddress}/>);
export const AddressFromERevMax = () => (
    <HotelAddress country={addressERevMax.country} locality={addressERevMax.locality} postalCode={addressERevMax.postalCode}
                  premise={addressERevMax.premise} streetAddress={addressERevMax.streetAddress}/>);
