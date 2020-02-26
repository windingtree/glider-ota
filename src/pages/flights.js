import React from 'react';
import Header from '../components/common/header/header';
import Footer from '../components/common/footer/footer';
import ContentWrapper from '../components/common/content-wrapper';
import FlightsSearchForm from '../components/flights-search-form/flights-search-form'
import SearchCriteriaBuilder from "../utils/search-criteria-builder";
import FlightSearchResultsConverter from "../utils/flight-search-results-converter";
import FlightsSearchResults from "../components/flights-search-results/flights-search-results";
import FlightDetail from "../components/flights-search-results/flight-detailed-view"
import dummy_data from '../data/response_converted.json'
import {extendResponse} from  '../utils/response-processor'
const OFFLINE_MODE = true;

const API_URL='/api/searchOffers/'

export default class FlightsPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            flight_search_results: OFFLINE_MODE?dummy_data:undefined,
            selected_offer:undefined
        };


        this.searchForFlights = this.searchForFlights.bind(this);
        this.displayOffer = this.displayOffer.bind(this);
    }

    searchForFlights (criteria) {
        this.search(criteria)
    }

    displayOffer (combinationId,offerId) {
        console.log("Display offer, offerID:",offerId," combination", combinationId)
        let results = this.state.flight_search_results
        let selectedCombination = results.combinations.find(c=>{return c.combinationId === combinationId})
        console.log("Found selected combination:",selectedCombination)
        this.setState({selected_offer:selectedCombination});
    }

    search (criteria) {

        const criteriaBuilder = new SearchCriteriaBuilder();

        // TODO - handle search from city/railstation and different pax types
        const searchCriteria = criteriaBuilder
            .withDepartureFromAirport(criteria.origin.id)
            .withDepartureDate(criteria.departureDate)
            .withReturnFromAirport(criteria.destination.id)
            .withReturnDate(criteria.returnDate)
            .withPassengers(criteria.adults,criteria.children,criteria.infants)
            .build();

        console.log('Search criteria', searchCriteria);
        const me = this;

        const requestInfo = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(searchCriteria)
        };
        console.log("Request info:",requestInfo);
        fetch(API_URL, requestInfo)
            .then(function (res) {
                return res.json()
            })
            .then(function (data) {
                me.handleSearchResultsReceived( data );
            }).catch(function (err) {
            console.log(err)
        })
    }
    handleSearchResultsReceived(results){
        // let converter = new FlightSearchResultsConverter(results);
        let convertedResponse = extendResponse(results);
        console.log("Converted results",convertedResponse)
        this.setState({ flight_search_results: convertedResponse })
    }

    render() {
        let searchResults=this.state.flight_search_results;
        let pricePlans = []
        let passengers = []



        let searchResultsAvailable = (searchResults !== undefined)
        if (searchResultsAvailable) {
            pricePlans = searchResults.pricePlans;
            passengers = searchResults.passengers;
            // selectedOffer = searchResults.combinations[0]
        }

        let offerWasSelected=(this.state.selected_offer!==undefined);
        let selectedOffer;
        if(offerWasSelected){
            selectedOffer=this.state.selected_offer;
        }

        return (
            <>
                {/*<Header/>*/}
                <ContentWrapper>
                    <FlightsSearchForm onSearchRequested={this.searchForFlights}/>
                    { searchResultsAvailable && !offerWasSelected &&
                        (<FlightsSearchResults onOfferDisplay={this.displayOffer} searchResults={searchResults} />)
                    }

                    {offerWasSelected &&
                        (<FlightDetail selectedOffer={selectedOffer} pricePlans={pricePlans} passengers={passengers}/>)
                    }
                </ContentWrapper>
                {/*<Footer/>*/}
            </>
        )
    }

}



