import React from 'react';
import { action } from '@storybook/addon-actions';

import Logo from './logo';

export default {
    component: Logo,
    title: 'Logo',
};


export const Default = () => <Logo/>;
export const Violet = () => (<Logo violet={true}/>);


