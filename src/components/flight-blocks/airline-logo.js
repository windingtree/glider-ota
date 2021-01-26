import React, {useState} from "react";
import style from "./airline-logo.module.scss";

const LOGOS_PATH='/airlines'
const DEFAULT_LOGO='missing.png';

export function AirlineLogo({iataCode,tooltip, airlineName, showAirlineNameOnMissing = false}){
    const [logoIsMissing,setLogoIsMissing] = useState(false);

    if(logoIsMissing === true){
        if(showAirlineNameOnMissing){
            return (<div className={style.missingAirlineName}>{airlineName}</div>)
        }else{
            let imgPath = `${LOGOS_PATH}/${DEFAULT_LOGO}`;
            return (<img key={iataCode} src={imgPath} title={tooltip} className={style.missingLogo}/>)
        }
    }else{
        let imgPath = `${LOGOS_PATH}/${iataCode}.png`;
        return (
            <img key={iataCode} src={imgPath} title={tooltip} className={style.airlineLogo} onError={() => setLogoIsMissing(true)}/>
        )
    }

}
