import React from "react";
import style from "./booking-flow-layout.module.scss";
import DevConLayout from "./devcon-layout";


export default function BookingFlowLayout({children, breadcrumb}) {
    return (
        <DevConLayout>
            {breadcrumb && <div className={style.breadCrumbWrapper}>{breadcrumb}</div>}
            <div className={style.contentWrapper}>{children}</div>
        </DevConLayout>)
}
