import React from 'react';
import {FulfilmentBreadcrumbs} from "./fulfilment-breadcrumbs"

export default {
    title: 'DC/common blocks/fulfilment breadcrumbs',
    component: FulfilmentBreadcrumbs
};

let items = ['Search','Traveller info','Flight details', 'Seat selection', 'Payment']

export const Default = () => (<FulfilmentBreadcrumbs/> )
export const BroadcrumbsWithoutActive = () => (<FulfilmentBreadcrumbs items={items}/> )
export const BroadcrumbsWithActive = () => (<FulfilmentBreadcrumbs items={items} currentItemIndex={2}/> )
