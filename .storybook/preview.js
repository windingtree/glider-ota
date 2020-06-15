import '../src/styles/glider.scss'

import { addParameters } from '@storybook/react';

const customViewports = {
    xsmall360: {
        name: 'XS 360(->639)',
        styles: {
            width: '360px',
            height: '963px',
        },
    },
    xsmall639: {
        name: 'XS (360)->639',
        styles: {
            width: '639px',
            height: '963px',
        },
    },
    small640: {
        name: 'SM 640(->989)',
        styles: {
            width: '640px',
            height: '963px',
        },
    },
    small989: {
        name: 'SM (640)->989',
        styles: {
            width: '989px',
            height: '963px',
        },
    },
    medium990: {
        name: 'MD 990(->1439)',
        styles: {
            width: '990px',
            height: '963px',
        },
    },
    medium1439: {
        name: 'MD (990)->1439',
        styles: {
            width: '1439px',
            height: '963px',
        },
    },
    large1440: {
        name: 'LG 1440(->1919)',
        styles: {
            width: '1440px',
            height: '963px',
        },
    },
    large1919: {
        name: 'LG (1440)->1919',
        styles: {
            width: '1919px',
            height: '963px',
        },
    },
    xlarge1919: {
        name: 'XL 1920 -> ...',
        styles: {
            width: '1920px',
            height: '801px',
        },
    },
};

addParameters({
    viewport: { viewports: customViewports },
});