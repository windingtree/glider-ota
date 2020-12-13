import React from "react";
import style from "./devcon-layout.module.scss";


export default function DevConLayout({children}) {
    return (
        <div className={style.outerPageWrapper}>
            <div className={style.innerPageWrapper}>
                {children}
            </div>
        </div>)
}
