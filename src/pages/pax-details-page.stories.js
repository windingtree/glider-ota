import React from 'react';
import DCPaxDetailsPage from "./pax-details-page";

export default {
    component: DCPaxDetailsPage,
    title: 'Pages/pax details page'
};

export const defaultPage = () => {
    return (<DCPaxDetailsPage/>);
}
