import React from 'react';
import { Router } from 'react-router';
import createMemoryHistory from 'history/createMemoryHistory';

import {
    action
} from '@storybook/addon-actions';
import HomePage from "./home-page";
import {addDecorator} from "@storybook/react";

const history = createMemoryHistory()
history.push = action('history.push')
history.replace = action('history.replace')
history.go = action('history.go')
history.goBack = action('history.goBack')
history.goForward = action('history.goForward')
addDecorator(story => <Router history={history}>{story()}</Router>)


export default {
    component: HomePage,
    title: 'Home page',
};

export const Default = () => (<HomePage/>);
