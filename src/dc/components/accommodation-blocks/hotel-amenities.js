import React,{useState} from 'react';
import style from "./hotel-amenities.module.scss"
import {ExpandCollapseToggle} from "../common-blocks/expand-collapse-toggle"
const Amenity = ({amenity}) => {
    return (
        <div className={style.amenity}>{amenity}</div>
    )
}


const Amenities = ({amenities = []}) => {
    amenities = amenities || []

    return (<>
        {amenities.map(amenity=>(<Amenity amenity={amenity}/>))}
    </>)
}

export const HotelAmenities = ({amenities, defaultExpanded = false}) => {
    const [expanded, setExpanded] = useState(defaultExpanded)

    return (
        <>
            <div className={style.amenitiesTitle}>Amenities <ExpandCollapseToggle expanded={expanded} onToggle={setExpanded}/></div>
            {expanded && (<Amenities amenities={amenities}/>)}
        </>
    )
}



