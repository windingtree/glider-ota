import React, {useState, useEffect} from 'react';
import {Col, Row} from "react-bootstrap";
import TripRates from "./fare-families/flight-rates";

import {useHistory} from "react-router-dom";
import {FlightSearchResultsWrapper} from "../../utils/flight-search-results-wrapper";
import _ from 'lodash';
import Button from "react-bootstrap/Button";
import {
    addFlightToCartAction,
    flightOfferSelector, isShoppingCartUpdateInProgress,
    requestCartUpdateAction
} from "../../redux/sagas/shopping-cart-store";
import {connect} from "react-redux";
import {
    flightSearchResultsSelector, isShoppingResultsRestoreInProgressSelector,
    requestSearchResultsRestoreFromCache
} from "../../redux/sagas/shopping-flow-store";
import Spinner from "../common/spinner";


export  function AncillariesSelectionContent(props) {
    const {offerId, flightSearchResults, setSelectedOffer, restoreCartFromServer, restoreSearchResultsFromCache, workInProgress} = props;
    let history = useHistory();
    let searchResultsWrapper;
    let tripRates;
    let selectedOffer;
    console.log('AncillariesSelectionContent, offerId',offerId, 'flightSearchResults is null?',(!flightSearchResults), ' workInProgress=',workInProgress)
    if(flightSearchResults){
        searchResultsWrapper = new FlightSearchResultsWrapper(flightSearchResults);
        tripRates = searchResultsWrapper.generateTripRatesData(offerId);
        selectedOffer = tripRates.offers[offerId]
    }


    function onBackButtonClick() {
        let url='/pax';
        history.push(url);
    }
    function onProceedButtonClick() {
        let url='/seatmap';
        history.push(url);
    }
    const syncInProgressSpinner = () => {
        return (
            <div>
                <Spinner enabled={true}/>
                <span>Please wait</span>
            </div>
        );

    }

    function handleOfferChange(offerId){
        setSelectedOffer(offerId);
        // if(!searchResultsWrapper)
        //     return;

        // let offer=searchResultsWrapper.getOffer(offerId);
        // offerId,offer,price,itineraries
        setSelectedOffer(offerId);
        /*let results = storeSelectedOffer(offer);    //FIXME - unnecessary since it's already in shopping cart
        results.then((response) => {
        }).catch(err => {
            console.error("Failed to add selecteed offer to a shopping cart", err);
            //TODO - add proper error handling (show user a message)
        })*/
    }


/*    //store initially selected offerID in cart
    useEffect(()=>{
        handleOfferChange(offerId)
    },[])*/


    useEffect(()=>{
        if(!offerId){
            restoreCartFromServer();
        }
        if(!flightSearchResults){
            restoreSearchResultsFromCache();
        }
    },[])

    if(!flightSearchResults){
        return (<>
            {workInProgress===true && syncInProgressSpinner()}
        </>)
    }

    return (
        <>
            <div>
                <div className='root-container-subpages'>
                    {workInProgress===true && syncInProgressSpinner()}
                    <FareFamilies
                        tripRates={tripRates}
                        selectedOffer={selectedOffer}  onSelectedOfferChange={handleOfferChange}/>
                    {/*<TotalPriceButton price={selectedOffer.price} proceedButtonTitle="Proceed" onProceedClicked={onProceedButtonClick}/>*/}
                    <NaviButtons prevEnabled={true} nextEnabled={true} onPrev={onBackButtonClick} onNext={onProceedButtonClick}/>

                </div>
            </div>
        </>
    )
}

export function FareFamilies({tripRates, selectedOffer, onSelectedOfferChange}) {
    const [currentOffer] = useState(selectedOffer)
    let history = useHistory();
    let baselineFare = _.get(history,'location.state.baselineFare');
    function handleSelectedOfferChange(offerId) {
        // displayOffer(offerId);
        onSelectedOfferChange(offerId)
    }


    let itineraries = tripRates.itineraries;
    return (
        <>
            <div>
                <Row>
                    <Col>
                        <TripRates itineraries={itineraries}
                                   tripRates={tripRates}
                                   selectedOffer={currentOffer}
                                   baselineFare={baselineFare}
                                   onOfferChange={handleSelectedOfferChange}/>
                    </Col>
                </Row>
                <Row className='pb-5'>
                    <Col>
                        {/*<PriceSummary price={currentOffer.price} onPayButtonClick={handlePayButtonClick}/>*/}
                    </Col>
                </Row>

                <Row className='pb-5'>

                </Row>

            </div>
        </>
    )
}

const NaviButtons = ({prevEnabled, nextEnabled, onPrev, onNext})=>{
    return(
        <Row className={'pt-3 pb-5'}>
            <Col xs={5}>
                <Button className={'btn-block'} variant="outline-primary"  disabled={prevEnabled===false} onClick={onPrev}>Back</Button>
            </Col>
            <Col xs={2}>
                <div className={'pt-2'}/>
            </Col>
            <Col xs={5}>
                <Button className={'btn-block'} variant="primary"  disabled={nextEnabled===false} onClick={onNext}>Proceed</Button>
            </Col>
        </Row>
    )
}


const mapStateToProps = state => ({
    flightSearchResults:flightSearchResultsSelector(state),
    offerId: flightOfferSelector(state)?flightOfferSelector(state).offerId:undefined,
    offer:flightOfferSelector(state),
    workInProgress: isShoppingResultsRestoreInProgressSelector(state) || isShoppingCartUpdateInProgress(state)
});


const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedOffer: (offerId) =>{
            dispatch(addFlightToCartAction(offerId));
        },
        restoreCartFromServer: () => {
            dispatch(requestCartUpdateAction())
        },
        restoreSearchResultsFromCache: ()=>{
            dispatch(requestSearchResultsRestoreFromCache())
        }
    }
}

// FareFamilies = withRouter(FareFamilies)

export default connect(mapStateToProps, mapDispatchToProps)(AncillariesSelectionContent);
