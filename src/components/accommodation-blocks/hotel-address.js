import React from 'react';
import style from "./hotel-address.module.scss"
import lookup from 'country-code-lookup';
import _ from 'lodash';

const countryCodeToCountry = (isoCode) => {
    if(!isoCode) {
        return null;
    }
    let result = null;
    try {
        result = lookup.byIso(isoCode);
        if (result)
            return result.country;
    }catch(err){
        console.log(`Cannot determine country name for country code:${isoCode}`);
    }
    return null;
}
export const HotelAddress = ({address, streetAddress, locality, postalCode, country, premise}) => {
    if(address){
        streetAddress = address.streetAddress;
        locality = address.locality;
        postalCode = address.country;
        premise = address.premise;
        country = address.country;
    }

    let cityWithPostal = `${postalCode} ${_.startCase(locality)}`;
    let countryName = countryCodeToCountry(country);
    countryName = countryName || country;
    let addressStr = [streetAddress, cityWithPostal, countryName, premise].map(a=>_.startCase(_.lowerCase(a))).join(', ');

    return (
        <div className={style.hotelAddress}>{addressStr}</div>
    )
}


