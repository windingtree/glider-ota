import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import { Provider } from 'react-redux';
import  store from './redux/store';

import ReactDOM from 'react-dom'
// import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/glider.scss'
// import './styles/icons.css'
import FlightTripOverviewPage from "./pages/flight-trip-overview-page"
import HotelDetailsPage from "./pages/hotel-details-page"
import FlightsSearchPage from "./pages/flights-search-page"
import HotelsSearchPage from "./pages/hotels-search-page"
import HomePage from "./pages/home-page"
import { CookiesProvider } from 'react-cookie';
import ConfirmationPage from "./pages/confirmation-page";
import FlightSeatmapPage from "./pages/flight-seatmap-page";
import FlightFareFamiliesPage from "./pages/flight-farefamilies-page";
import FlightPassengersPage from "./pages/flight-passengers-page";
import FlightSummaryPage from "./pages/flight-summary-page";
import PaymentPage from "./pages/payment-page";

import PaymentCryptoPage from "./pages/payment-crypto-page";
import DCLandingPage from './dc/pages/landing-page'
import DCTravellerInfoPage from './dc/pages/traveller-info-page'
import AncillariesSelection from './dc/components/ancillaries/ancillaries-selection-content'
import DCFlightPassengersPage from './dc/pages/pax-details-page'
import DCAncillariesPage from './dc/pages/ancillaries-page'
import DCSeatSelectionPage from './dc/pages/seat-selection-page'
import DCPaymentSummaryPage from './dc/pages/payment-summary-page'
import DCPaymentPage from "./dc/pages/payment-page";
import DCPaymentCryptoPage from "./dc/pages/payment-crypto-page";
import DCConfirmationPage from "./dc/pages/confirmation-page";
import DCPayComponent from './dc/components/common/payment/payment-selector';
function Dispatcher() {
    return (
        <Provider store={store}>
            <CookiesProvider>
                <Router>
                    <Switch>
                        {/*Flights flow*/}
                        <Route path="/flights/tripoverview/:offerId" component={FlightTripOverviewPage}/>
                        <Route path="/flights/farefamilies/:offerId" component={FlightFareFamiliesPage}/>
                        <Route path="/flights/seatmap/:offerId/:segmentId?" component={FlightSeatmapPage}/>
                        <Route path="/flights/passengers/:offerId" component={FlightPassengersPage}/>
                        <Route path="/flights/summary/:offerId" component={FlightSummaryPage}/>
                        <Route path="/flights/" component={FlightsSearchPage}/>

                        <Route path="/payment/:confirmedOfferId" component={PaymentPage}/>
                        <Route path="/crypto/:confirmedOfferId" component={PaymentCryptoPage}/>
                        <Route path="/confirmation/:confirmedOfferId" component={ConfirmationPage}/>

                        {/*<Route path="/summary/:offerId" component={FlightOffer}/>*/}
                        {/*<Route path="/confirmation/" component={FlightOffer}/>*/}

                        {/*Hotels flow*/}
                        <Route path="/hotels/" component={HotelsSearchPage}/>
                        <Route path="/hotel/:accommodationId?" component={HotelDetailsPage}/>
                        <Route path="/dc/pay/" component={DCPayComponent} />
                        {<Route path="/dc/pax/" component={DCFlightPassengersPage}/>}
                        {<Route path="/dc/ancillaries/" component={DCAncillariesPage}/>}
                        {<Route path="/dc/seatmap/" component={DCSeatSelectionPage}/>}
                        {<Route path="/dc/summary/" component={DCPaymentSummaryPage}/>}
                        {/* <Route path="/dc/payment/:confirmedOfferId" component={DCPaymentPage}/>
                        <Route path="/dc/crypto/:confirmedOfferId" component={DCPaymentCryptoPage}/> */}
                        <Route path="/dc/confirmation/:confirmedOfferId" component={ConfirmationPage}/>
                        <Route path="/dc/" component={DCLandingPage}/>


                        <Route path="/" component={HomePage} />
                    </Switch>
                </Router>
            </CookiesProvider>
        </Provider>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));
