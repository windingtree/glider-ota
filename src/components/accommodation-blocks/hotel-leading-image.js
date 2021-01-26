import style from "./hotel-leading-image.module.scss";
import {Image} from "react-bootstrap";
import React from "react";

export function HotelLeadingImage({url}){
    return (
        <div className={style.mainImageContainer}>
            <Image className={style.mainImage} src={url}/>
        </div>
    )
}
