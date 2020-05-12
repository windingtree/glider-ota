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
import Sandbox from "./pages/sandbox/sandbox";
import ConfirmationPage from "./pages/confirmation-page";
import SeatmapPage from "./pages/seatmap";


function Dispatcher() {
    return (
        <CookiesProvider>
            <Router>
                <Switch>
                    <Route path="/flights/" component={FlightsPage}/>
                    <Route path="/flightoffer/:combinationId/:offerId" component={FlightOffer}/>
                    <Route path="/seatmap/:offerId" component={SeatmapPage}/>
                    {/*<Route path="/summary/:offerId" component={FlightOffer}/>*/}
                    {/*<Route path="/confirmation/" component={FlightOffer}/>*/}

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
