
//display unicorn badge and handle onClick event to populate flight dates
import {venueConfig} from "../venue-context/theme-context";
import {UnicornBadge} from "../common-blocks/unicorn-badge";
import ArrowIcon from "../../assets/arrow-up-right.svg";
import React from "react";

export const UnicornVenueBadge = ({
    onBadgeClick,
    isDates = true
}) => {
    if(!venueConfig.active)
        return (<></>)
    const {badgeVenueName,destinationName} = venueConfig;
    const label = isDates ? badgeVenueName : destinationName;
    return (
        <div style={{paddingTop:'4px'}}>
            <UnicornBadge onClick={onBadgeClick}>
                {label} <img alt={label} src={ArrowIcon} height='11px' width='11px' border='0'/>
            </UnicornBadge>
        </div>
    );
}
