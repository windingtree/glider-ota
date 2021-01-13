import React from "react";
import style from "./devcon-layout.module.scss";


export default function DevConLayout(props) {
    return (
        <div className={style.pageWrapper}>
            <header className={style.devconHeader}>
              <a href="/">Your Logo</a>
            </header>
            <div className={props.pageClass ? " " + props.pageClass : ""}>
                {props.children}
            </div>
            <footer className={style.devconFooter}>
                <nav>
                    <ul>
                        <li><a href="/dc/faq">FAQ</a></li>
                        <li><a href="/dc/terms-of-service">Terms of Service</a></li>
                        <li><a href="/dc/privacy-policy">Privacy Policy</a></li>
                    </ul>
                </nav>
            </footer>
        </div>)
}
