import React, {useRef, useState} from 'react';
import style from "./hotel-images.module.scss"
import {Splide, SplideSlide} from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

export const ImageGallery = ({images}) => {
    const [selectedImage, setSelectedImage] = useState();
    const secondaryRef = useRef();

    const secondaryOptions = {
        type        : 'slide',
        rewind      : true,
        gap         : '1rem',
        pagination  : false,
        fixedWidth  : 110,
        fixedHeight : 70,
        cover       : true,
        isNavigation: true,
        updateOnMove: true,
        arrows: true,
        perPage: 3,
        classes: {
            prev: style.splideArrowPrev,
            next: style.splideArrowNext,
            track: `splide__track`
        }
    };
    console.log('Splide options', secondaryOptions);

    const onThumbnailClicked = (slide, param1) => {
        setSelectedImage(images[param1.index]);
    }
    const onArrows = () => {
    }

    const getImages = () =>{
        if(!images || !Array.isArray(images))
            return [];
        return images.map(({url})=>{return {src:url, alt:''}})
    }

    const renderSlides = () => {
        return getImages().map( slide => (
            <SplideSlide key={ slide.src }>
                <img src={ slide.src } alt={ slide.alt } className={style.slideImage}/>
            </SplideSlide>
        ) );
    };

    const mouseClicked = () => {
        setSelectedImage(undefined)
    }

    return (
        <>
            {selectedImage && <div className={style.imagePreviewContainer} onClick={mouseClicked}><img alt='room preview' src={selectedImage.url}/></div>}
        <Splide options={ secondaryOptions } ref={ secondaryRef } onClick={onThumbnailClicked} onArrowsMounted={onArrows}>
            { renderSlides() }
        </Splide>
        </>
    );
}
