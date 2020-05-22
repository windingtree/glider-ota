import React from 'react';
import SegmentSelector from './segment-selector'

export default {
  title: 'Seatmap/Segment Selector',
};

export const segmentSelectorOneStop = () => (
    <SegmentSelector
        stops={['Moscow','Doha','Puhket']}
        flightTime='1h 15min'
        index={0}
    />
);

export const segmentSelectorOneStopLast = () => (
    <SegmentSelector
        stops={['Moscow','Doha','Puhket']}
        flightTime='1h 15min'
        index={1}
    />
);

export const segmentSelectorNonStop = () => (
    <SegmentSelector
        stops={['Moscow','Puhket']}
        flightTime='1h 15min'
        index={0}
    />
);


export const segmentSelectorTwoStops = () => (
    <SegmentSelector
        stops={['Brussels','London','New-York','Montreal']}
        flightTime='1h 15min'
        index={2}
    />
);

export const segmentSelectorThreeStopsBRULON = () => (
    <SegmentSelector
        stops={['Brussels','London','New-York','Montreal','Caracas']}
        flightTime='10h 15min'
        index={0}
    />
);

export const segmentSelectorThreeStopsLONNYC = () => (
    <SegmentSelector
        stops={['Brussels','London','New-York','Montreal','Caracas']}
        flightTime='10h 15min'
        index={1}
    />
);

export const segmentSelectorThreeStopsNYCYUL = () => (
    <SegmentSelector
        stops={['Brussels','London','New-York','Montreal','Caracas']}
        flightTime='10h 15min'
        index={2}
    />
);

export const segmentSelectorThreeStopsYULCRC = () => (
    <SegmentSelector
        stops={['Brussels','London','New-York','Montreal','Caracas']}
        flightTime='10h 15min'
        index={3}
    />
);