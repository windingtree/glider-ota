import React from 'react';
import DCLandingPage from "./landing-page";

export default {
    component: DCLandingPage,
    title: 'DC/Pages/landing page'
};

export const defaultPage = () => {
    return (<DCLandingPage/>);
}
