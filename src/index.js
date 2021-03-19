import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import { Provider } from 'react-redux';
import  store from './redux/store';
import reportWebVitals from './reportWebVitals';
import ReactDOM from 'react-dom'
import './styles/glider.scss'
import { CookiesProvider } from 'react-cookie';
import DCLandingPage from './pages/landing-page'
import DCFlightPassengersPage from './pages/pax-details-page'
import DCAncillariesPage from './pages/ancillaries-page'
import DCSeatSelectionPage from './pages/seat-selection-page'
import DCPaymentSummaryPage from './pages/payment-summary-page'
import ConfirmationPage from './pages/confirmation-page'
import MarkdownPage from './pages/markdown-page'
import ThemedStyleSheet from 'react-with-styles/lib/ThemedStyleSheet';
import aphroditeInterface from 'react-with-styles-interface-aphrodite';
import { customDatePickerTheme } from './custom-date-picker-theme';
import ErrorCatcher from "./components/error-catcher";
import {CookieConsentBanner} from "./components/cookie-consent-banner/cookie-consent-banner";
import {
    GoogleAnalyticsPageViewReporter,
    sendWebVitalsToAnalytics
} from "./components/cookie-consent-banner/google-analytics";
ThemedStyleSheet.registerInterface(aphroditeInterface);
ThemedStyleSheet.registerTheme(customDatePickerTheme());
                                                                                                                                                                                            
function Dispatcher() {
    return (
        <ErrorCatcher>
        <Provider store={store}>
            <CookiesProvider>                                                                       
                <Router>
                    <GoogleAnalyticsPageViewReporter/>
                    <CookieConsentBanner/>

                    <Switch>
                        <Route path="/pax/" component={DCFlightPassengersPage}/>
                        <Route path="/ancillaries/" component={DCAncillariesPage}/>
                        <Route path="/seatmap/" component={DCSeatSelectionPage}/>
                        <Route path="/summary/" component={DCPaymentSummaryPage}/>
                        <Route path="/confirmation/:confirmedOfferId" component={ConfirmationPage}/>
                        <Route path="/flights" component={DCLandingPage}/>
                        <Route path="/hotels" component={DCLandingPage}/>
                        <Route path="/terms-of-service" component={MarkdownPage}/>
                        <Route path="/privacy-policy" component={MarkdownPage}/>
                        <Route path="/faq" component={MarkdownPage}/>
                        <Redirect push from="/" to="/hotels" />
                    </Switch>
                </Router>
            </CookiesProvider>
        </Provider>
        </ErrorCatcher>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(sendWebVitalsToAnalytics);
