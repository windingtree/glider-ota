import React from "react";
import style from "./booking-flow-layout.module.scss";


export default function BookingFlowLayout({children, breadcrumb}) {
    return (
        <div className={style.outerPageWrapper}>
            <div className={style.innerPageWrapper}>
                {breadcrumb && <div className={style.breadCrumbWrapper}>{breadcrumb}</div>}
                <div className={style.contentWrapper}>{children}</div>
            </div>
        </div>)
}
