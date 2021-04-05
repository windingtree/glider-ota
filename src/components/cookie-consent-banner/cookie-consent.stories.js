import React from 'react';
import {CookieConsentBanner} from "./cookie-consent-banner"

export default {
    title: 'common blocks/Cookie Consent',
    component: CookieConsentBanner
};

export const Active = () => (
    <div>
        <CookieConsentBanner/>
    </div> )
