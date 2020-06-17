import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import style from './footer.module.scss'
import Logo from "../logo";

export default function Footer(props) {
    return (
        <footer className={style.footer}>
            <Container fluid={true}>
                <Row noGutters={true}>
                    <Col lg={1}>
                        <Container fluid={true} className={style.footerLogo}>
                            <Row noGutters={true}>
                                    <Logo violet={true}/>
                            </Row>
                            <Row>
                                <div className={style.accreditation}>
                                    <a href="https://iata.org/">
                                        <img
                                            src='/images/iata_logo.png'
                                            border='0'
                                            alt='IATA Accredited Agent'
                                        />
                                    </a>
                                    <small>IATA Accreditation: #63320235</small>
                                </div>
                            </Row>
                        </Container>
                    </Col>
                    <Col >
                        <Container className='root-container-mainpage'>
                            <Row >
                                <Col  md={6} >
                                    <div className={style.footerNavTitle}>Launching partners</div>
                                    <div className={style.footerNavLink}>
                                        <a href="https://www.aircanada.com">Air Canada</a>
                                    </div>
                                    <div className={style.footerNavLink}>
                                        <a href="https://www.nordicchoicehotels.com">Nordic Choice Hotels</a>
                                    </div>
                                    <div className={style.footerNavLink}>
                                        <a href="https://www.erevmax.com">eRevMax</a>
                                    </div>
                                </Col>
                                <Col  md={6} >
                                    <div className={style.footerNavTitle}>Contact</div>
                                    <div className={style.footerNavLink}>
                                        <a href='mailto:hello@glider.travel'>hello@glider.travel</a>
                                    </div>
                                    <div className={style.footerNavLink}>
                                        Harju maakond, Tallinn Kesklinna linnaosa, Tartu mnt 67/1-13b, 10115
                                    </div>
                                </Col>
                            </Row>
                            <Row noGutters={true}>
                                <Col xs={12} sm={3}>
                                    <div className={style.footerNavLink}>Operated by Simard OÜ</div>
                                </Col>
                                <Col xs={12} sm={3}>
                                    <div className={style.footerNavLink}>Terms of use</div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Container fluid={true}>
                                        <Row noGutters={true}>
                                            <Col>
                                                <a href="https://github.com/windingtree">
                                                    <img
                                                        src="/images/github_icon.png"
                                                        className={style.icon}
                                                        border="0"
                                                        alt='Github Repository'
                                                    />
                                                </a>
                                            </Col>
                                            <Col>
                                                <a href="https://twitter.com/windingtree">
                                                    <img
                                                        src="/images/twitter_icon.png"
                                                        className={style.icon}
                                                        border="0"
                                                        alt='Twitter Feed'
                                                    />
                                                </a>
                                            </Col>
                                            <Col>
                                                <a href="https://blog.windingtree.com/">
                                                    <img
                                                        src="/images/medium_icon.png"
                                                        className={style.icon}
                                                        border="0"
                                                        alt='Official Blog on Medium'
                                                    />
                                                </a>
                                            </Col>
                                            <Col>
                                                <a href="https://t.me/windingtree">
                                                    <img
                                                        src="/images/telegram_icon.png"
                                                        className={style.icon}
                                                        border="0"
                                                        alt='Telegram Channel'
                                                    />
                                                </a>
                                            </Col>
                                            <Col>
                                                <a href="https://www.reddit.com/r/windingtree/">
                                                    <img
                                                        src="/images/reddit_icon.png"
                                                        className={style.icon}
                                                        border="0"
                                                        alt='Reddit Community'
                                                    />
                                                </a>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col lg={1}></Col>
                </Row>

            </Container>
        </footer>)
}
