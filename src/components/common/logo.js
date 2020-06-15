import React from "react";
import PropTypes from 'prop-types';
import style from './logo.module.scss'



export default function Logo({altText = 'Glider OTA', title = 'Glider', href='/', violet = false}){
    let image="/images/logo_white.png";
    let linkCss=style.logoHref;
    if(violet){
        image="/images/logo_violet.png";
        linkCss=style.logoHrefViolet;
    }


    return (
        <div className={style.logo}>
            <a href={href} className={linkCss}><img alt={altText} className={style.logoImage} src={image} /></a>
            <a href={href} className={linkCss}>{title}</a>
        </div>
    )
}


Logo.propTypes = {
    title:PropTypes.string,
    href:PropTypes.string,
    altText:PropTypes.string,
    violet:PropTypes.bool
}


