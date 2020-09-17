import React from 'react';

import Logo from './logo';

export default {
    component: Logo,
    title: 'Logo',
};


export const Default = () => <Logo/>;
export const Violet = () => (<Logo violet={true}/>);


