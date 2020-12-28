import React from 'react';

import RoundTripSelector from './index';
export default {
    component: RoundTripSelector,
    title: 'Round-trip Selector',
};

export const RoundTripSelectorStory = () => (
    <RoundTripSelector
        label='Round-trip'
        checked={true}
        onChange={state => {
            console.log('Checked:', state);
        }}
    />
);
