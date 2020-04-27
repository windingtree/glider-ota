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
import Hotel from "./pages/hotel"
import FlightsPage from "./pages/flights"
import HotelsPage from "./pages/hotels"
import HomePage from "./pages/home"
import { CookiesProvider } from 'react-cookie';
import PaymentForm from "./components/payments/payment-form";
import Sandbox from "./pages/sandbox/test";
import ConfirmationPage from "./pages/confirmation-page";


function Dispatcher() {
    return (
        <CookiesProvider>
            <Router>
                <Switch>
                    <Route path="/flightoffer/:combinationId?/:offerId?" component={FlightOffer}/>
                    <Route path="/flights/" component={FlightsPage}/>
                    <Route path="/hotels/" component={HotelsPage}/>
                    <Route path="/hotel/:accommodationId?" component={Hotel}/>
                    <Route path="/confirmation/:orderId" component={ConfirmationPage}/>
                    <Route path="/payments" >
                        <PaymentForm />
                    </Route>
                    <Route path="/test" component={Sandbox}/>
                    <Route path="/" component={HomePage} />
                </Switch>
            </Router>
        </CookiesProvider>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));
