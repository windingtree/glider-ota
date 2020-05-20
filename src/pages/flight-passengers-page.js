import React, {useState,useEffect} from 'react';
import Header from '../components/common/header/header';
import {useHistory} from "react-router-dom";
import {retrieveOfferFromLocalStorage,retrieveSearchResultsFromLocalStorage} from "../utils/search"
import {Button} from "react-bootstrap";
import PaxDetails from "../components/passengers/pax-details";
import {storePassengerDetails,retrievePassengerDetails} from "../utils/api-utils"

export default function FlightPassengersPage({match}) {
    let history = useHistory();
    const [passengerDetails,setPassengerDetails] = useState()
    const [passengerDetailsValid,setPassengerDetailsValid] = useState(false)
    let offerId = match.params.offerId;

    function proceedToSeatmap(){
        let url='/flights/seatmap/'+offerId;
        history.push(url);
    }
    function onPaxDetailsChange(paxData, allPassengersDetailsAreValid){
        setPassengerDetails(paxData)
        setPassengerDetailsValid(allPassengersDetailsAreValid)
    }

    useEffect(()=>{
        console.log("Load pax details from session");
        let passengers = createInitialPassengersFromSearch();
        console.log("Pax details loaded from session:",passengers);
        let result=retrievePassengerDetails();

        result.then(response=>{
            console.log("Pax details from search results:",response);
            passengers = Object.assign(passengers,response);
            console.log("Pax details combined:",result);
        }).catch(err=>{
            console.error("Failed to load passenger details", err);
        }).finally(()=>{
            console.log("Finally:",passengers)
            setPassengerDetails(passengers);
        })
    },[])


    function addToCart(){
        console.log("addToCart", passengerDetails)
        let results = storePassengerDetails(passengerDetails);
            results.then((response) => {
                console.log("Successfully saved pax details", response);
                proceedToSeatmap();
         }).catch(err => {
             console.error("Failed to store passenger details", err);

         })
    }

    /**
     * if initial search was for e.g. 2 adults and 1 child, we need to initialize passenger form with 2 adults and 1 child.
     * This function does that (based on search form criteria)
     * @returns {[]}
     */
    function createInitialPassengersFromSearch()
    {
        let searchResults = retrieveSearchResultsFromLocalStorage();
        let paxData = searchResults.passengers;
        let passengers=[];
        Object.keys(paxData).map(paxId=>{
            let record = {id: paxId,
                type: paxData[paxId].type
            }
            passengers.push(record)
        })
        return passengers;
    }

    console.debug("FlightPassengersPage, render")
    return (
        <>
            <div>
                <Header violet={true}/>
                <div className='root-container-subpages'>

                    Passenger details: {offerId}
                    <PaxDetails passengers={passengerDetails} onDataChange={onPaxDetailsChange}/>
                    <Button className='primary' onClick={addToCart} disabled={!passengerDetailsValid}>Proceed to seatmap</Button>
                </div>
            </div>
        </>
    )
}
