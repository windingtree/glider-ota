import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,useParams
} from "react-router-dom";

import ReactDOM from 'react-dom'
import SearchFlightsPage from './pages/search-flights-page'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import Header from './components/common/header/header'
import Footer from './components/common/footer/footer'
import FlightDetail from "./components/flights-search-results/flight-detailed-view";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HotelsPage from "./pages/hotels"
import FlightsPage from "./pages/flights"
import HomePage from "./pages/home"





function FlightOffer(){
    let { combinationId ,offerId } = useParams();
    console.log("CombinationID",combinationId)
    console.log("offerId",offerId)
    return (
        <>
            <Header/>
            <FlightDetail/>
            <Footer/>
        </>
    )
}



function Dispatcher() {
    return (
        <Router>
            <span> <Link to="/">Home</Link> <Link to="/flights">Flights</Link> <Link to="/flightoffer">Offer</Link> <Link to="/hotels">Hotels</Link></span>
                <Switch>
                    <Route path="/hotels">
                        <HotelsPage/>
                    </Route>

                    <Route path="/flights">
                        <FlightsPage/>
                    </Route>
                    <Route path="/">
                        <HomePage />
                    </Route>
                </Switch>
        </Router>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));
