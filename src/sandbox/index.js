import React, {useState} from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from "react-router-dom";
import Typography from "./typography";
import Flex from "./flex";
import Hotels from "./hotels";
import Filters from "./filters";

export default function Sandbox({}) {
    return (
        <Router>
            {<span> <Link to="/sandbox/flex">Flex</Link> <Link to="/sandbox/typography">Typography</Link>  <Link to="/sandbox/hotels">Hotels</Link></span>}
            <Switch>
                <Route path="/sandbox/filters">
                    <Filters/>
                </Route>
                <Route path="/sandbox/flex">
                    <Flex/>
                </Route>
                <Route path="/sandbox/hotels">
                    <Hotels/>
                </Route>
                <Route path="/sandbox/typography">
                    <Typography/>
                </Route>
                <Route path="/sandbox/">
                    playground
                </Route>
            </Switch>
        </Router>
    )
}


