import React from 'react';
import {CookieConsentBanner} from "./cookie-consent-banner"
import {Button} from "react-bootstrap";

export default {
    title: 'common blocks/Cookie Consent',
    component: CookieConsentBanner
};

export const Active = () => (
    <div>
        <Button onClick={()=>console.log('clicked')}>Click me</Button>
        <CookieConsentBanner/>
    </div> )
