import React,{useState} from 'react';
import {AncillarySelectableItem} from "./ancillary-selectable-item"

export default {
    title: 'DC/common blocks/ancillary selectable item',
    component: AncillarySelectableItem
};

let benefits = [
    '2 checked bags free',
    'Premium meal service',
    'Maple Leaf Lounge access',
    'Exclusive cabin with fully lie-flat seats',
    'Inspired cuisine, selected wines and spirits',
    'Priority check-in, security, baggage and boarding',
    '150% Aeroplan Miles',
    'Free changes, cancellations and standby'
]

let price = "123.4$";

export const Default = () => (
    <AncillarySelectableItem items={benefits} price={price} name={"Economy Flexible"} isDisabled={false}
                             isSelected={false}/>)
export const DefaultSelected = () => (
    <AncillarySelectableItem items={benefits} price={price} name={"Economy Flexible"} isDisabled={false}
                             isSelected={true}/>)
export const DefaultDisabled = () => (
    <AncillarySelectableItem items={benefits} price={price} name={"Economy Flexible"} isDisabled={true}
                             isSelected={false}/>)
export const WithDescription = () => (
    <AncillarySelectableItem items={benefits} description={'40cm x 50cm x 20cm, max 20kg'} price={price}
                             name={"Economy Flexible"} isDisabled={true} isSelected={false}/>)

