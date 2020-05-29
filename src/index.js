import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

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


function Dispatcher() {
    return (
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
                    <Route path="/confirmation/:confirmedOfferId" component={ConfirmationPage}/>

                    {/*<Route path="/summary/:offerId" component={FlightOffer}/>*/}
                    {/*<Route path="/confirmation/" component={FlightOffer}/>*/}

                    {/*Hotels flow*/}
                    <Route path="/hotels/" component={HotelsSearchPage}/>
                    <Route path="/hotel/:accommodationId?" component={HotelDetailsPage}/>


                    <Route path="/" component={HomePage} />
                </Switch>
            </Router>
        </CookiesProvider>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));
