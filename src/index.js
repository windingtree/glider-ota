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
import FlightOffer from "./pages/flightoffer"
import FlightsPage from "./pages/flights"
import HotelsPage from "./pages/h"
import HomePage from "./pages/home"
import { CookiesProvider } from 'react-cookie';
import PaymentForm from "./components/payments/payment-form";
import TestHistory from "./components/payments/test";
import ConfirmationPage from "./pages/confirmation-page";


function Dispatcher() {
    return (
        <CookiesProvider>
            <Router>
                <Switch>
                    <Route path="/flightoffer/:combinationId?/:offerId?" component={FlightOffer}>
                    </Route>
                    <Route path="/flights/:action?/:orig?/:dest?/:departureDate?/:returnDate?/:adults?/:children?/:infants?" component={FlightsPage}>
                    </Route>
                    <Route path="/hotels/:action?/:dest?/:departureDate?/:returnDate?/:adults?/:children?/:infants?" component={HotelsPage}>
                    </Route>
                    <Route path="/confirmation/:orderId" component={ConfirmationPage}>
                    </Route>
                    <Route path="/payments" >
                        <PaymentForm />
                    </Route>
                    <Route path="/test" >
                        <TestHistory/>
                    </Route>
                    <Route path="/" >
                        <HomePage />
                    </Route>
                </Switch>
            </Router>
        </CookiesProvider>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));
