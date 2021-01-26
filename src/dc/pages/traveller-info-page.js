import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import PaxDetails from "../components/passengers/pax-details";
import {retrievePassengerDetails} from "../../utils/api-utils"
import Alert from 'react-bootstrap/Alert';
import Spinner from "../components/common/spinner";
import {Button} from "react-bootstrap";

export default function DCTravellerInfoPage({searchCriteriaPassengers}) {
    let history = useHistory();
    const [passengerDetails, setPassengerDetails] = useState();
    const [passengerDetailsValid,setPassengerDetailsValid] = useState(false);
    const [highlightInvalidFields, setHighlightInvalidFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onPaxDetailsChange = (paxData, allPassengersDetailsAreValid) => {
        console.log('onPaxDetailsChange, all valid?==>',allPassengersDetailsAreValid)
        setPassengerDetails(paxData)
        setPassengerDetailsValid(allPassengersDetailsAreValid)
    }

    //Populate form with either passengers from session (if e.g. user refreshed page or clicked back) or initialize with number of passengers (and types) specified in a search form
    useEffect(()=>{
        let passengers = passengerDetails || createInitialPassengersFromSearch();
        let response=retrievePassengerDetails();
        response.then(result=> {
            if(Array.isArray(result)) {
                // Index passengers to ease the update
                let indexedPassengers = passengerDetails.reduce((acc, passenger) => {
                    acc[passenger.id] = passenger;
                    return acc;
                }, {});

                // Assign each received passenger to the passengers, if id matches.
                result.forEach(pax => {
                    if(indexedPassengers.hasOwnProperty(pax.id)) {
                        indexedPassengers[pax.id] = pax;
                    }
                })

                // Update the value
                passengers = Object.values(indexedPassengers);

            }
        }).catch(err=>{
            console.error("Failed to load passenger details", err);
            //TODO - add proper error handling (show user a message)
        }).finally(()=>{
            setPassengerDetails(passengers);
        })
    },[]);

//     function redirectToSeatmap(){
// /*        let url='/flights/seatmap/'+offerId;
//         history.push(url, {passengers: passengerDetails});*/
//     }

    const proceedToNextStep = () => {
        let url='/step2';
        history.push(url);
    }
/*
    function savePassengerDetailsAndProceed() {
        setIsLoading(true);
        let results = storePassengerDetails(passengerDetails);
        results.then((response) => {
            // console.debug("Successfully saved pax details", response);
            redirectToSeatmap();
        }).catch(err => {
            console.error("Failed to store passenger details", err);
            setHighlightInvalidFields(true);
            setPassengerDetailsValid(false);
        })
            .finally(() => {
                setIsLoading(false);
            });
    }
*/

    const PassengerInvalidAlert = () => (
        <Alert variant="danger">
            <Alert.Heading>Some passenger details are invalid</Alert.Heading>
            <p>
                We are sorry, we are missing some passenger details for this reservation.<br/>
                Please review and complete the passenger details to proceed.
            </p>
        </Alert>
    );

    // Display a loading spinner
    const loadingSpinner = () => {
        return (
            <div>
                <Spinner enabled={true}/>
                <span>We are validating the passenger details</span>
            </div>
        );

    }

    /**
     * if initial search was for e.g. 2 adults and 1 child, we need to initialize passenger form with 2 adults and 1 child.
     * This function does that (based on search form criteria)
     * @returns {[]}
     */
    const createInitialPassengersFromSearch = () => {
        let paxData = searchCriteriaPassengers || {};
        return Object.keys(paxData).map(paxId => {
            return {
                id: paxId,
                type: paxData[paxId].type
            }
        });
    }
    return (
        <>
            <div>
                <div className='root-container-subpages'>
                    <PaxDetails
                        passengers={passengerDetails}
                        onDataChange={onPaxDetailsChange}
                        highlightInvalidFields={highlightInvalidFields}
                    />
                    {highlightInvalidFields && PassengerInvalidAlert()}
                    {isLoading && loadingSpinner()}
                    <Button disabled={passengerDetailsValid!==true} onClick={proceedToNextStep}>Proceed to flight options</Button>
                </div>

            </div>
        </>
    )
}
