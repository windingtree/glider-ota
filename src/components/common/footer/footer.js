import React from 'react'
import {Container, Row, Col, Nav} from 'react-bootstrap'
import style from './footer.module.scss'
import Logo from "../logo";

export default function Footer(props) {
    return (
        <footer className={style.footer}>
            <Container fluid={true}>
                <Row noGutters={true}>
                    <Col lg={4} xs={12}>
                      <div className={style.logo}><Logo violet={true}/></div>
                    </Col>
                    <Col lg={8} xs={12}>

                        <Container fluid={true}>
                            <Row noGutters={true}>
                                <Col xs={12} sm={3} >
                                    <div className={style.footerNavTitle}>Airlines</div>
                                    <div className={style.footerNavLink}><a href="https://www.airfrance.com">Air
                                        France</a></div>
                                    <div className={style.footerNavLink}><a href="https://www.aircanada.com">Air
                                        Canada</a></div>

                                </Col>
                                <Col xs={12} sm={3}>
                                    <div className={style.footerNavTitle}>Hotels</div>
                                    <div className={style.footerNavLink}><a href="https://www.nordicchoicehotels.com">Nordic
                                        Choice Hotels</a></div>
                                    <div className={style.footerNavLink}><a href="https://www.mhc.travel">Machefert
                                        Hotels</a></div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div className={style.footerNavTitle}>Contact</div>
                                    <div className={style.footerNavLink}>
                                        Harju maakond, Tallinn Kesklinna linnaosa, Tartu mnt 67/1-13b, 10115
                                    </div>
                                    <div className={style.footerNavLink}><a
                                        href='mailto:info@windingtree.com'>info@windingtree.com</a></div>
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
                                            <Col><a href="http://"><img src="images/github_icon.png"
                                                                        className={style.icon} border="0"/></a></Col>
                                            <Col><a href="http://"><img src="images/twitter_icon.png"
                                                                        className={style.icon} border="0"/></a></Col>
                                            <Col><a href="http://"><img src="images/medium_icon.png"
                                                                        className={style.icon} border="0"/></a></Col>
                                            <Col><a href="http://"><img src="images/telegram_icon.png"
                                                                        className={style.icon} border="0"/></a></Col>
                                            <Col><a href="http://"><img src="images/reddit_icon.png"
                                                                        className={style.icon} border="0"/></a></Col>
                                        </Row>
                                    </Container>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>

            </Container>
        </footer>)
}
