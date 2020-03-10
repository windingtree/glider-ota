import React, {useState} from 'react';
import FlightsSearchResults from "../components/flights-search-results/flights-search-results";
import FlightDetail from "../components/flights-offer-details/flight-detailed-view"


export default function FlightsPage({searchResults}) {
    const [selected_combination, setSelectedCombination] = useState();
    const [selectedOffer, setSelectedOffer] = useState();

    function displayOffer(combinationId, offerId) {
        console.log("Display offer, offerID:", offerId, " combination", combinationId);
        let selectedCombination = searchResults.combinations.find(c => {
            return c.combinationId === combinationId
        })
        let selectedOffer = selectedCombination.offers.find(o => {
            return o.offerId === offerId
        })
        //TODO - simplify
        setSelectedCombination(selectedCombination);
        setSelectedOffer(selectedOffer);
    }

    let searchResultsAvailable = (searchResults !== undefined)
    let combinationWasSelected = (selected_combination !== undefined);

    return (
        <>

            {searchResultsAvailable && !combinationWasSelected &&
            (<FlightsSearchResults
                onOfferDisplay={displayOffer}
                searchResults={searchResults}/>)
            }

            {combinationWasSelected &&
            (<FlightDetail
                selectedCombination={selected_combination}
                selectedOffer={selectedOffer}
                searchResults={searchResults}/>)
            }
        </>
    )
}



