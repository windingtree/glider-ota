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
import HotelsPage from "./pages/hotels"
import FlightsPage from "./pages/flights"
import HomePage from "./pages/home"
import PaymentForm from "./pages/payment";
import Sandbox from "./sandbox/index";
import { CookiesProvider } from 'react-cookie';


function Dispatcher() {
    return (
        <CookiesProvider>
            <Router>
                {/*<span> <Link to="/">Home</Link> <Link to="/flights">Flights</Link> <Link to="/flightoffer">Offer</Link> <Link to="/hotels">Hotels</Link></span>*/}
                <Switch>
                    {/*                    <Route path="/hotels">
                        <HotelsPage/>
                    </Route>
                    <Route path="/flights">
                        <FlightsPage/>
                    </Route>*/}
                    <Route path="/sandbox">
                        <Sandbox/>
                    </Route>
                    <Route path="/payments/:orderID">
                        <PaymentForm/>
                    </Route>
                    <Route path="/">
                        <HomePage />
                    </Route>
                </Switch>
            </Router>
        </CookiesProvider>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));
