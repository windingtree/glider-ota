import React from 'react';

import {
  action
} from '@storybook/addon-actions';
import {FlightsSearchForm, HotelsSearchForm} from "./search-form";

export default {
  title: 'Search form/form',
};

export const DefaultHotelSearchForm = () => (<HotelsSearchForm />);
export const DefaultFlightsSearchForm = () => (<FlightsSearchForm />);
