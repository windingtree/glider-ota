import React, {useState,useEffect} from 'react';
import PaxDetails from "../components/passengers/pax-details";
import {storePassengerDetails,retrievePassengerDetails} from "../../utils/api-utils"
import Alert from 'react-bootstrap/Alert';
import Spinner from "../components/common/spinner";
import DevConLayout from "../components/layout/devcon-layout";
import {cartContentsSelector,currentStepSelector} from "../../redux/sagas/booking";
import {restoreCartFromServerAction} from "../../redux/sagas/cart";
import {connect} from "react-redux";


export function DCFlightPassengersPage({shoppingCart}) {
    const [passengerDetails, setPassengerDetails] = useState();
    const [passengerDetailsValid,setPassengerDetailsValid] = useState(false);
    const [highlightInvalidFields, setHighlightInvalidFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function onPaxDetailsChange(paxData, allPassengersDetailsAreValid){
        setPassengerDetails(paxData)
        setPassengerDetailsValid(allPassengersDetailsAreValid)
    }

    console.log('DCFlightPassengersPage, shopping cart:',shoppingCart)
    //Populate form with either passengers from session (if e.g. user refreshed page or clicked back) or initialize with number of passengers (and types) specified in a search form
    useEffect(()=>{
        console.log('useEffect, sshoppingCart',shoppingCart)
        if(!shoppingCart || (!shoppingCart.flightOffer && shoppingCart.hotelOffer)){
            console.log('Shopping cart is empty, restoring')
            restoreCartFromServerAction().then(data=>{
                console.log('Cart restored, data:', data)
            })
        }


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

    function redirectToSeatmap(){
        let url='/flights/seatmap/';
        // history.push(url, {passengers: passengerDetails});
    }

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
    function createInitialPassengersFromSearch()
    {
        // let searchResults = retrieveSearchResultsFromLocalStorage();
        let searchResults={
            passengers:{
                'PAX1':{
                    type:'ADT'
                }
            }
        }
        let paxData = searchResults.passengers;
        let passengers = Object.keys(paxData).map(paxId => {
            return {
                id: paxId,
                type: paxData[paxId].type
            }
        });
        return passengers;
    }
    return (
        <DevConLayout>
                    <PaxDetails
                        passengers={passengerDetails}
                        onDataChange={onPaxDetailsChange}
                        highlightInvalidFields={highlightInvalidFields}
                    />
                    {highlightInvalidFields && PassengerInvalidAlert()}
                    {isLoading && loadingSpinner()}
        </DevConLayout>
    )
}



const mapStateToProps = state => ({
    shoppingCart:cartContentsSelector(state),
    currentStep: currentStepSelector(state),
    // error: errorSelector(state)
});


const mapDispatchToProps = (dispatch) => {
    return {
        restoreCart: (offer) => {
            dispatch(restoreCartFromServerAction())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(DCFlightPassengersPage);
