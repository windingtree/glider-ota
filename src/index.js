import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import ReactDOM from 'react-dom'
import SearchFlightsPage from './pages/search-flights-page'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import Header from './components/header/header'
import Footer from './components/footer/footer'
import FlightDetail from "./components/flights-search-results/flight-detailed-view";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function Index() {
    return (
    <>
        <Header/>
        Index
        <Footer/>
    </>
    )
}
function Flights() {
    return (
        <>
            <Header/>
            <ContentWrapper>
                <SearchFlightsPage/>
            </ContentWrapper>
            <Footer/>
        </>
    )
}

function Hotels() {
    return (
        <>
            <Header/>Hotels
            <Footer/>
        </>
    )
}

function FlightOffer() {
    return (
        <>
            <Header/>
            <FlightDetail/>
            <Footer/>
        </>
    )
}


function FlightDetails() {
    return (
        <>
            <Header/>FlightDetails
            <Footer/>
        </>
    )
}

function ContentWrapper(props){
    return (
        <Container>
            <Row noGutters>
                <Col className="content-wrapper">
                {props.children}
                </Col>
            </Row>
        </Container>
    )
}

function Dispatcher() {
    return (
        <Router>
            <span> <Link to="/">Home</Link> <Link to="/flights">Flights</Link> <Link to="/flight/details">Offer</Link> <Link to="/hotels">Hotels</Link></span>
                <Switch>
                    <Route path="/hotels">
                        <Hotels />
                    </Route>
                    <Route path="/flights/details/">
                        <FlightOffer />
                    </Route>
                    <Route path="/flights">
                        <Flights />
                    </Route>
                    <Route path="/">
                        <Index />
                    </Route>
                </Switch>
        </Router>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));
