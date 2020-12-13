import React from 'react';

import FlightsShoppingComponent from "./flights-shopping-component";

import {ProviderWrapper} from "../../redux-stories-helper"
import {addDecorator} from "@storybook/react";
addDecorator(story =>  <ProviderWrapper>{story()}</ProviderWrapper>)

export default {
    title: 'DC/Flights shopping',
    component:FlightsShoppingComponent
};


export const Default = () => (<FlightsShoppingComponent/>);

