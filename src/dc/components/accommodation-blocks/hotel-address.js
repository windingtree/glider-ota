import React from 'react';
import style from "./hotel-address.module.scss"
import lookup from 'country-code-lookup';
import _ from 'lodash';

const countryCodeToCountry = (isoCode) => {
    let result = lookup.byIso(isoCode);
    if(result)
        return result.country;
    return null;
}
export const HotelAddress = ({streetAddress, locality, postalCode, country, premise}) => {
    let cityWithPostal = `${postalCode} ${_.startCase(locality)}`;
    let countryName = countryCodeToCountry(country);
    countryName = countryName || country;
    let address = [streetAddress, cityWithPostal, countryName, premise].map(a=>_.startCase(_.lowerCase(a))).join(', ');

    return (
        <div className={style.hotelAddress}>{address}</div>
    )
}


