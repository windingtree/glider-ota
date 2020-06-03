

export default class FareFamilyHelper {
  constructor(tripRates){
    this.tripRates = tripRates;
  }

  /**
   * For a given itinerary, find all available price plans and return an ascending order (order in which they should be displayed in the UI).
   * It returns an array containing price plan IDs.
   * @param itinId
   * @returns {*[]}
   */
  getItineraryPricePlansInAscendingOrder(itinId){
    let pricePlansMinFares={};
    //iterate over price plans and find lowest available price for a given price plan ID and store it in hashmap(planID -> price)
    Object.keys(this.tripRates.offers).forEach(offerId=>{
      let offer = this.tripRates.offers[offerId];
      if(offer.itinToPlanMap[itinId]){
        let pricePlanId = offer.itinToPlanMap[itinId];
        let price = offer.price.public;
        if(!pricePlansMinFares[pricePlanId] || pricePlansMinFares[pricePlanId]>price)
          pricePlansMinFares[pricePlanId] = price;
      }
    })
    //we have lowest fares for price planID, now we need a list of price plans and sort it by price (ascending)
    let plans=[];
    Object.keys(pricePlansMinFares).map(pricePlanId=>{
      plans.push({pricePlanId:pricePlanId, price:pricePlansMinFares[pricePlanId]})
    })
    //sort it
    plans.sort((a,b)=>{
      if(parseInt(a.price)<parseInt(b.price)) return -1;
      else if(parseInt(a.price)>parseInt(b.price)) return 1;
      else return 0;
    })
    let res=plans.map(a=>a.pricePlanId);
    //we only need to return array of price plan IDs
    return res;
  }

  /**
   * Once the user selects a given offer (which is combination of price plans), for other alternative price plans we need to display price difference
   * (e.g. EconomyLowFlex price is 100,
   * EconomyHighFlex is 160.
   * If user selects EconomyLowFlex, we should show 60 as a difference needed to cover for EconomyHighFlex
   *
   * @param selectedOfferId - currently selected offer
   * @param itinId - current itinerary
   * @returns {{}}
   */
  getItineraryPricePlanOffsetPrices(selectedOfferId, itinId){
    let selectedOffer=this.tripRates.offers[selectedOfferId];
    let currentPrice = selectedOffer.price.public;
    //we will need to compare if other offers have same price plans on every itinerary except itinID (parameter)
    //make a copy of selected offer pricePlanID <--> itinID
    let selectedOfferItinToPlanMap=Object.assign({},selectedOffer.itinToPlanMap);
    //in loop we will be comparing other offers to check if they have same price plans assigned to itins EXCEPT itinID
    //so we remove itinID from hashmap
    let currentItinPricePlanId=selectedOfferItinToPlanMap[itinId];
    delete selectedOfferItinToPlanMap[itinId];
    let pricePlanOffsets = {}
    //now iterate over all offers and find those that have same price plans assiged to the rest of itineraries
    Object.keys(this.tripRates.offers).forEach(offerId=> {
      let candidateOffer = this.tripRates.offers[offerId];
      let candidateOfferItinToPlanMap = Object.assign({},candidateOffer.itinToPlanMap)
      let candidatePricePlanId = candidateOfferItinToPlanMap[itinId];
      //here we also have to remove current itinID from hashmap
      delete candidateOfferItinToPlanMap[itinId];
      if(selectedOfferId === candidateOffer.offerId){
        pricePlanOffsets[currentItinPricePlanId]={
          offerId: selectedOfferId,
          priceOffset:{
            public: 0,
            currency: candidateOffer.price.currency
          }
        };
      }else if(JSON.stringify(selectedOfferItinToPlanMap) === JSON.stringify(candidateOfferItinToPlanMap)){
        //we found another offer that has same price associated with the rest of itins (except itinID from parameter)
        let candidatePrice = candidateOffer.price.public;
        let priceDiff = candidatePrice-currentPrice;
        //TODO: what if currency codes are different? should not happen but....
        pricePlanOffsets[candidatePricePlanId]={
          offerId: candidateOffer.offerId,
          priceOffset:{
            public: priceDiff,
            currency: candidateOffer.price.currency
          }
        };
        //we can now calculate price offset (vs currently selected offer)
      }
    });

    return pricePlanOffsets;
  }
}
