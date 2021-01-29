import React, {useRef} from 'react';
import style from "./hotel-images.module.scss"
import {Splide, SplideSlide} from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

export const ImageGallery = ({images}) => {
    const secondaryRef = useRef();
    const secondaryOptions = {
        type        : 'slide',
        rewind      : true,
        gap         : '1rem',
        pagination  : false,
        fixedWidth  : 110,
        fixedHeight : 70,
        cover       : true,
        focus       : 'center',
        isNavigation: true,
        updateOnMove: true,
        arrow: false
    };

    const onThumbnailClicked = (slide) => {
        console.log('Clicked', slide)
    }
    const onArrows = (slide) => {
        console.log('onArrows', slide)
    }

    const getImages = () =>{
        if(!images || !Array.isArray(images))
            return [];
        return images.map(({url})=>{return {src:url, alt:''}})
    }

    const renderSlides = () => {
        return getImages().map( slide => (
            <SplideSlide key={ slide.src } >
                <img src={ slide.src } alt={ slide.alt } className={style.slideImage} />
            </SplideSlide>
        ) );
    };

    return (
        <>
        <Splide options={ secondaryOptions } ref={ secondaryRef } onClick={onThumbnailClicked} onArrowsMounted={onArrows}>
            { renderSlides() }
        </Splide>
        </>
    );
}
