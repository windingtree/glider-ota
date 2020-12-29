import React from "react";
import style from "./devcon-layout.module.scss";


export default function DevConLayout(props) {
    return (
        <div className={style.outerPageWrapper}>
            <div className={style.innerPageWrapper}>
                <div className={props.pageClass ? " " + props.pageClass : ""}>
                    {props.children}
                </div>
            </div>
        </div>)
}
