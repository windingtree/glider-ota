import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage,retrieveSearchResultsFromLocalStorage} from "../utils/search"
import {Button} from "react-bootstrap";
import PaxDetails from "../components/passengers/pax-details";


export default function FlightPassengersPage({match}) {
    let history = useHistory();
    const [passengerDetails,setPassengerDetails] = useState()
    let offerId = match.params.offerId;
    let offer = retrieveOfferFromLocalStorage(offerId);
    let searchResults = retrieveSearchResultsFromLocalStorage();
    let passengers = searchResults.passengers;
    console.log("Offer",offer);
    console.log("Passengers",passengers);

    function onProceedButtonClick(){
        let url='/flights/seatmap/'+offerId;
        history.push(url);
    }

    function onPaxDetailsChange(paxData){
        console.log("onPaxDetailsChange",paxData)
        setPassengerDetails(paxData)
    }

    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>

                    Passenger details: {offerId}
                    <PaxDetails passengers={passengers} onDataChange={onPaxDetailsChange}/>


                    <Button className='primary' onClick={onProceedButtonClick}>Proceed to seatmap</Button>
                </div>
            </div>
        </>
    )
}
