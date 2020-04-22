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
import PaymentForm from "./pages/payment";


function Dispatcher() {
    return (
        <CookiesProvider>
            <Router>
                <Switch>
                    <Route path="/flightoffer/:combinationId?/:offerId?" component={FlightOffer}>
                    </Route>
                    <Route path="/flights/:orig?/:dest?/:departureDate?/:returnDate?/:adults?/:children?/:infants?" component={FlightsPage}>
                    </Route>
                    <Route path="/hotels/:dest?/:departureDate?/:returnDate?/:adults?/:children?/:infants?" component={HotelsPage}>
                    </Route>
                    <Route path="/payments" >
                        <PaymentForm />
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
