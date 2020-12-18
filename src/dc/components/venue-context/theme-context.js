import venue from "./venue.json"


const getDate = (strDate, defaultValue) =>{
    try{
        return new Date(strDate)
    }catch(err){

    }
    return defaultValue;
}

export const venueConfig={
    originIata:venue.originIata,
    destinationIata:venue.destinationIata,
    originLocation:venue.originLocation,
    destinationLocation:venue.destinationLocation,
    venueName:venue.venueName,
    startDate:getDate(venue.start_date),
    endDate:getDate(venue.end_date)
}
