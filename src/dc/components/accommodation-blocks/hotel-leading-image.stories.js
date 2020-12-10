import React from 'react';
import {HotelLeadingImage} from "./hotel-leading-image"

export default {
    title: 'DC/accommodation blocks/hotel leading image',
    component: HotelLeadingImage
};
let image="https://s3.amazonaws.com/images.hotels/images/02034/QualityHotel11Gothenburg1.jpg"
export const Images = () => (<HotelLeadingImage url={image}/> )
