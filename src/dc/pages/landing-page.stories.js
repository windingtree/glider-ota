import React from 'react';
import DCLandingPage from "./landing-page";

import {
    action
} from '@storybook/addon-actions';

export default {
    component: DCLandingPage,
    title: 'DC/pages/landing page',
    excludeStories: /.*Data$/,
};

export const defaultPage = () => {
    return (<DCLandingPage/>);
}
