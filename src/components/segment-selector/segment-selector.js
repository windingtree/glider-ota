import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'
import './segment-selector.scss';

export default function SegmentSelector(props) {
    // Destructure properties
    const {
        stops,
        flightTime,
        segmentIndex,
    } = props;

    // Compute the progress bar value
    const getProgress = () => {
        // Force last segment to 100%
        if(Number(segmentIndex) === (stops.length - 2)) {
            return 100;
        }

        // Previous segments are slightly shifted right
        // So we let 2% on the right and 2% on the left to align with first and last cities
        return Number(2 + 96* (Number(segmentIndex) + 1) / (stops.length - 1)).toFixed(0);
    }

    return (
        <div className='segment-selector'>
            <div className='flight-time'>{flightTime}</div>
            <ProgressBar now={getProgress()}/>
            <div className='route'>
                {stops.map(stop => (<div>{stop}</div>))}
            </div>
        </div>
    )
}