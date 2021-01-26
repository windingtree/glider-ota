import React from 'react';
import BookingFlowLayout from "../components/layout/booking-flow-layout"
import PaxDetailsContent from "../components/passengers/pax-details-content"
import BookingFlowBreadcrumb, {STEPS} from "../components/common-blocks/breadcrumbs"


export default function DCPaxDetailsPage() {
    let breadcrumb = <BookingFlowBreadcrumb currentStepId={STEPS.TRAVELLER_INFO}/>
    return (<BookingFlowLayout breadcrumb={breadcrumb}>
        <PaxDetailsContent/>
    </BookingFlowLayout>)
}


