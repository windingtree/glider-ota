import React from 'react';

import Header from './header';

export default {
    component: Header,
    title: 'Header'
};

export const MainPageHeader = () => <Header/>;
export const SearchResults = () => (<Header violet={true}/>);


