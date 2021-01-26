import React from 'react';
import {AirlineLogo} from './airline-logo'
export default {
    title: 'flight blocks/airline logo',
    component:AirlineLogo
};

export const AirlineWithExistingLogo = () => (<AirlineLogo iataCode={'MN'} tooltip={'Kulula airlines'} airlineName={'Kulula'}/> );
export const MissingLogoDefaultImage = () => (<AirlineLogo iataCode={'MISSING'} tooltip={'Tooltip'} airlineName={'Airline'}/> );
export const MissingLogoDefaultName = () => (<AirlineLogo iataCode={'MISSING'} tooltip={'Tooltip'} airlineName={'Airline'} showAirlineNameOnMissing={true}/> );
