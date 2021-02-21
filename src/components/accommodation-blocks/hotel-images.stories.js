import React from 'react';
import {ImageGallery} from "./hotel-images"

export default {
    title: 'accommodation blocks/image gallery',
    component: ImageGallery
};
let images1= [
    {
        "type": "photo",
        "width": "1024",
        "height": "681",
        "url": "https://s3.amazonaws.com/images.hotels/images/02034/QualityHotel11Gothenburg1.jpg"
    },
    {
        "type": "photo",
        "width": "419",
        "height": "500",
        "url": "https://s3.amazonaws.com/images.hotels/images/02034/QualityHotel11Gothenburg2.jpg"
    },
    {
        "type": "photo",
        "width": "1024",
        "height": "683",
        "url": "https://s3.amazonaws.com/images.hotels/images/02034/QualityHotel11Gothenburg3.jpg"
    },
    {
        "type": "photo",
        "width": "1024",
        "height": "576",
        "url": "https://s3.amazonaws.com/images.hotels/images/02034/QualityHotel11Gothenburg4.jpg"
    }
]
let images2=[
    {
        "type": "photo",
        "width": "1024",
        "height": "564",
        "url": "https://s3.amazonaws.com/images.hotels/images/04393/ClarionHotelTheHub1.jpg"
    },
        {
            "type": "photo",
            "width": "1024",
            "height": "667",
            "url": "https://s3.amazonaws.com/images.hotels/images/04393/ClarionHotelTheHub2.jpg"
        },
        {
            "type": "photo",
            "width": "1024",
            "height": "683",
            "url": "https://s3.amazonaws.com/images.hotels/images/04393/ClarionHotelTheHub3.jpg"
        },
        {
            "type": "photo",
            "width": "1024",
            "height": "683",
            "url": "https://s3.amazonaws.com/images.hotels/images/04393/ClarionHotelTheHub4.jpg"
        }
    ]
let images3 = [
    {
        "type": "photo",
        "width": "1024",
        "height": "683",
        "url": "https://s3.amazonaws.com/images.hotels/images/07119/110997074.jpg"
    },
    {
        "type": "photo",
        "width": "1024",
        "height": "662",
        "url": "https://s3.amazonaws.com/images.hotels/images/07119/110998049.jpg"
    },
    {
        "type": "photo",
        "width": "1024",
        "height": "677",
        "url": "https://s3.amazonaws.com/images.hotels/images/07119/161752398.jpg"
    },
    {
        "type": "photo",
        "width": "1024",
        "height": "678",
        "url": "https://s3.amazonaws.com/images.hotels/images/07119/161752404.jpg"
    },
    {
        "type": "photo",
        "width": "1024",
        "height": "683",
        "url": "https://s3.amazonaws.com/images.hotels/images/07119/1.jpg"
    },
    {
        "type": "photo",
        "width": "1024",
        "height": "678",
        "url": "https://s3.amazonaws.com/images.hotels/images/07119/2.jpg"
    },
    {
        "type": "photo",
        "width": "1024",
        "height": "662",
        "url": "https://s3.amazonaws.com/images.hotels/images/07119/3.jpg"
    },
    {
        "type": "photo",
        "width": "1024",
        "height": "672",
        "url": "https://s3.amazonaws.com/images.hotels/images/07119/4.jpg"
    }
]
let big=[...images1,...images2,...images3];
export const Images = () => (<ImageGallery images={images1}/> )
export const Images2 = () => (<ImageGallery images={images2}/> )
export const Images3 = () => (<ImageGallery images={big}/> )
