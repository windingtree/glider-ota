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
import Hotel from "./pages/hotel"
import FlightsSearchPage from "./pages/flights-search-page"
import HotelsPage from "./pages/hotels"
import HomePage from "./pages/home-page"
import { CookiesProvider } from 'react-cookie';
import PaymentForm from "./components/payments/payment-form";
import ConfirmationPage from "./pages/confirmation-page";
import FlightSeatmapPage from "./pages/flight-seatmap-page";
import FlightFareFamiliesPage from "./pages/flight-farefamilies-page";
import FlightPassengersPage from "./pages/flight-passengers-page";
import FlightSummaryPage from "./pages/flight-summary-page";


function Dispatcher() {
    return (
        <CookiesProvider>
            <Router>
                <Switch>
                    {/*Flights flow*/}
                    <Route path="/flights/tripoverview/:combinationId/:offerId" component={FlightTripOverviewPage}/>
                    <Route path="/flights/farefamilies/:combinationId/:offerId/:itineraryId?" component={FlightFareFamiliesPage}/>
                    <Route path="/flights/seatmap/:offerId/:segmentId?" component={FlightSeatmapPage}/>
                    <Route path="/flights/passengers/:offerId" component={FlightPassengersPage}/>
                    <Route path="/flights/summary/:offerId" component={FlightSummaryPage}/>
                    <Route path="/flights/" component={FlightsSearchPage}/>
                    {/*<Route path="/summary/:offerId" component={FlightOffer}/>*/}
                    {/*<Route path="/confirmation/" component={FlightOffer}/>*/}

                    {/*Hotels flow*/}
                    <Route path="/hotels/" component={HotelsPage}/>
                    <Route path="/hotel/:accommodationId?" component={Hotel}/>
                    <Route path="/confirmation/:orderId" component={ConfirmationPage}/>

                    <Route path="/payments" >
                        <PaymentForm />
                    </Route>
                    <Route path="/" component={HomePage} />
                </Switch>
            </Router>
        </CookiesProvider>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));
