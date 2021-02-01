import React from "react";
import style from "./devcon-layout.module.scss";
import { useHistory } from 'react-router-dom';


export default function DevConLayout(props) {
    const history = useHistory();
    return (
        <div className={style.pageWrapper}>
            <header
                className={style.header}
                onClick={() => { window.location.assign(window.location.origin); }}
            >
            </header>
            <div className={props.pageClass ? " " + props.pageClass : ""}>
                {props.children}
            </div>
            <footer className={style.devconFooter}>
                <nav>
                    <ul>
                        <li><a href="/faq">FAQ</a></li>
                        <li><a href="/terms-of-service">Terms of Service</a></li>
                        <li><a href="/privacy-policy">Privacy Policy</a></li>
                    </ul>
                </nav>
            </footer>
        </div>)
}
