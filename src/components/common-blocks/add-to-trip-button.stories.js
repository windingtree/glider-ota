import React from 'react';
import {AddToTrip} from "./add-to-trip-button"

export default {
    title: 'common blocks/Add-To-Trip button',
    component: AddToTrip
};

export const Active = () => (<AddToTrip isAlreadyAdded={false} priceAmount={100} priceCurrency={"USD"}/> )
export const AlreadyAdded = () => (<AddToTrip isAlreadyAdded={true} priceAmount={100} priceCurrency={"$"}/> )
