import React from 'react';
import { LandingExplainer, REASONS } from './landing-explainer';


export default {
    title: 'Landing/Explainer'
};


export const Default = () => (<LandingExplainer/> );

export const Small = () => (<LandingExplainer reasons={[REASONS[0],REASONS[1]]}/> );
