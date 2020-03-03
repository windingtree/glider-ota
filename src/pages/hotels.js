import React from 'react';
import Header from '../components/common/header/header';
import Footer from '../components/common/footer/footer';
import ContentWrapper from '../components/common/content-wrapper';
import SearchForm from "../components/flights-search-form/search-form";
import dummy_data from '../data/sample_response_hotels.json'
import FlightsSearchResults from "../components/flights-search-results/flights-search-results";
import HotelsSearchResults from "../components/hotels-search-results/hotels-search-results";
const OFFLINE_MODE = true;

const API_URL='/api/searchOffers'

export default class HotelsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hotels_search_results: OFFLINE_MODE?dummy_data:undefined
        };

        this.searchForHotels = this.searchForHotels.bind(this);
        this.displayOffer = this.displayOffer.bind(this);
    }

    searchForHotels(criteria) {
        console.log("Search for hotels", criteria)
    }

    displayOffer () {
        console.log("Display offer")
    }


    render(props) {
        const searchResults = this.state.hotels_search_results;
        return (
            <>
                <Header/>
                <ContentWrapper>
                    <SearchForm onSearchRequested={this.searchForHotels} enableOrigin={false} locationsSource={'cities'} oneWayAllowed={false}/>
                    <HotelsSearchResults onOfferDisplay={this.displayOffer} searchResults={searchResults} />
                </ContentWrapper>
                <Footer/>
            </>
        )
    }
}
