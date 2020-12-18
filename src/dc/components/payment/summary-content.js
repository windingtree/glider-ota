import React, {useState,useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {Button} from "react-bootstrap";
import PaxSummary from "../passengers/pax-summary";
import {repriceShoppingCartContents, retrievePassengerDetails} from "../../../utils/api-utils";
import TotalPriceButton from "../common/totalprice/total-price";
import PaymentSummary from "./payment-summary";
import {FlightSearchResultsWrapper} from "../../../utils/flight-search-results-wrapper";
import Alert from 'react-bootstrap/Alert';
import Spinner from "../common/spinner"
import {
    flightOfferSelector, hotelOfferSelector,
    isShoppingCartInitializedSelector,
    requestCartRestoreFromServer
} from "../../../redux/sagas/shopping-cart-store";
import {connect} from "react-redux";
import style from "./summary-content.module.scss"
import {
    flightSearchResultsSelector,isShoppingFlowStoreInitialized, isShoppingResultsRestoreInProgressSelector,
    requestSearchResultsRestoreFromCache
} from "../../../redux/sagas/shopping-flow-store";
import {JourneySummary} from "../flight-blocks/journey-summary";
import PaymentSelector from './payment-selector';
import {HotelOfferSummary} from "../hoteldetails/hotel-offer-summary";
import DevConLayout from "../layout/devcon-layout";


function RenderPleaseWait(){
    return (
        <>
            <div className='glider-font-text24medium-fg'>
                Please wait while we are confirming your price with the airline
                <Spinner enabled={true}></Spinner>
            </div>
        </>
    )
}

export function SummaryContent(props) {
    let history = useHistory();
    const {onRestoreShoppingCart,refreshInProgress,isShoppingCartStoreInitialized, isShoppingFlowStoreInitialized,flightOffer, hotelOffer}=props;
    const [passengerDetails, setPassengerDetails] = useState();
    const [confirmedOffer, setConfirmedOffer] = useState();
    const [loadInProgress, setLoadInProgress] = useState(false);
    const [pricingFailed, setPricingFailed] = useState(false);
    // let offerId = match.params.offerId;

    // let offer = retrieveOfferFromLocalStorage(offerId);


    function onProceedButtonClick(){
        let url='/dc/payment/'+confirmedOffer.offerId;
        history.push(url, { passengers: passengerDetails });
    }

    function onProceedCryptoButtonClick(){
        let url=`/dc/crypto/${confirmedOffer.offerId}`;
        history.push(url, { passengers: passengerDetails });
    }


    function onEditFinished(){
        loadPassengerDetailsFromServer();
    }

    function loadPassengerDetailsFromServer(){
        let response=retrievePassengerDetails();
        response.then(passengers=>{
            //sort passengers (ADT>CHD>INF)
            passengers.sort((a,b)=>{
                let typeA=a.type?a.type:'ADT';  //if there is no type - assume it's adult
                let typeB=b.type?b.type:'ADT';
                return typeA.localeCompare(typeB);
            })
            setPassengerDetails(passengers);
        }).catch(err=>{
            console.error("Failed to load passenger details", err);
            //TODO - add proper error handling (show user a message)
        })
    }

    // Validate the price of the shopping cart
    function repriceItemsInCart() {
        setLoadInProgress(true);
        setPricingFailed(false);
        let response=repriceShoppingCartContents();
        response.then(offer=>{
            setConfirmedOffer(offer)
        }).catch(err=>{
            setPricingFailed(true);
        }).finally(()=>{
            setLoadInProgress(false)
        });
    }

    const PricingErrorAlert = () => (
        <Alert variant="danger">
            <Alert.Heading>We could not confirm your final price</Alert.Heading>
            <p>
                We are sorry, we could not confirm the final price with the airline.
                This indicates that this itinerary can not be sold at the moment.
                Please retry or change your itinerary.
            </p>
            <Button
                onClick={repriceItemsInCart}
                disabled={loadInProgress}>
                Retry
            </Button>
        </Alert>
    );

    //Populate summary with passengers details from session
    useEffect(()=>{
        if(!isShoppingCartStoreInitialized){
            console.log('Initialize shopping cart')
            onRestoreShoppingCart();
        }

        if(isShoppingCartStoreInitialized){
            //cart and results initialized
            //call reprice endpoint to get a final quote
            repriceItemsInCart();
        }

    },[isShoppingCartStoreInitialized, onRestoreShoppingCart])


    const displayFlightSummary = () =>
    {
        return (<><JourneySummary itineraries={flightOffer.itineraries}/><div className={'pb-1'}></div></>)
    }
    const displayHotelSummary = () =>
    {
        const {room, hotel, price, offer} = hotelOffer;
        return (<><HotelOfferSummary room={room}  hotel={hotel} offer={offer}/><div className={'pb-1'}></div></>)
    }



    return (


        <>
            <div>
                <div className='root-container-subpages'>
                    {flightOffer && displayFlightSummary()}
                    {hotelOffer && displayHotelSummary()}

                    {(loadInProgress||refreshInProgress) && <RenderPleaseWait/>}
                    {pricingFailed && PricingErrorAlert()}
                    {passengerDetails && <PaxSummary passengers={passengerDetails} onEditFinished={onEditFinished}/>}
                    {confirmedOffer &&
                    <>
                        <PaymentSummary offer = {confirmedOffer.offer}/>
                        <PaymentSelector
                            confirmedOffer={confirmedOffer}
                            passengers={passengerDetails}
                        />
                        {/* <TotalPriceButton
                            forPayment={true}
                            price={confirmedOffer.offer.price}
                            proceedButtonTitle="Pay with Card"
                            onProceedClicked={onProceedButtonClick}
                            onProceedCryptoClicked={onProceedCryptoButtonClick}
                        /> */}
                    </>
                    }
                </div>
            </div>
        </>
    )
}



const mapStateToProps = state => ({
    searchResults:flightSearchResultsSelector(state),
    offerId: flightOfferSelector(state)?flightOfferSelector(state).offerId:undefined,
    refreshInProgress:isShoppingResultsRestoreInProgressSelector(state),
    isShoppingFlowStoreInitialized: isShoppingFlowStoreInitialized(state),
    isShoppingCartStoreInitialized: isShoppingCartInitializedSelector(state),
    flightOffer: flightOfferSelector(state),
    hotelOffer: hotelOfferSelector(state),

});


const mapDispatchToProps = (dispatch) => {
    return {
        onRestoreSearchResults: () =>{
            dispatch(requestSearchResultsRestoreFromCache());
        },
        onRestoreShoppingCart: () =>{
            dispatch(requestCartRestoreFromServer());
        }

    }
}

// FareFamilies = withRouter(FareFamilies)

export default connect(mapStateToProps, mapDispatchToProps)(SummaryContent);
