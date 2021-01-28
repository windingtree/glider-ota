import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

import { Provider } from 'react-redux';
import  store from './redux/store';

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
ThemedStyleSheet.registerInterface(aphroditeInterface);
ThemedStyleSheet.registerTheme(customDatePickerTheme());

function Dispatcher() {
    return (
        <ErrorCatcher>
        <Provider store={store}>
            <CookiesProvider>
                <Router>
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
                        <Redirect push from="/" to="/flights" />
                        <Redirect push from="/" to="/flights" />
                    </Switch>
                </Router>
            </CookiesProvider>
        </Provider>
        </ErrorCatcher>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));
