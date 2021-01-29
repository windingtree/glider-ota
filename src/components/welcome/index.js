import React from 'react';
import { connect } from 'react-redux';
import {
    Container,
    Row,
    Col
} from 'react-bootstrap';
import {
    isBookingStartedSelector
} from '../../redux/sagas/shopping-flow-store';
import styles from './welcome.module.scss';

const Welcome = props => {
    const {
        infoHidden,
        contactHidden
    } = props;

    return (
        <>
            {!infoHidden &&
                <Container fluid={true} className={styles.container}>
                    <Row className={styles.infoRow}>
                        <Col>
                            <div className={styles.mainBlock}>
                                <h2>
                                    Yes, we have just decentralized the Travel
                                </h2>
                                <p>
                                    Here you can book airlines and hotels directly so that your payment goes to the travel provider and not to gatekeepers taking commissions
                                </p>
                                <p>
                                    No gatekeepers here, no hidden fees, no data selling. Only technologies and smart contracts doing their jobs.
                                </p>
                                <p>
                                    This is a 100% fair-trade travel booking platform
                                </p>
                            </div>
                        </Col>
                    </Row>
                    <Row className={styles.infoRow}>
                        <Col>
                            <div className={styles.infoBlock}>
                                <h3>
                                    Why booking here?
                                </h3>
                                <p>
                                    Shortly, you pay less
                                </p>
                            </div>
                            <div className={styles.infoBlock}>
                                <h3>
                                    Really? What’s the trick?
                                </h3>
                                <p>
                                    No trick, this is a decentralized application so you can book flights and hotels without intermediary humans between you and the travel
                                </p>
                                <p>
                                    Algorithms were already fully capable of connecting you with thousands of travel suppliers at the same time. But those algorithms serve their owners more than customers
                                </p>
                                <p>
                                    Now, blockchain enables airlines, hotels and other travel suppliers of any size to join the marketplace without paying crazy distribution fees to online agents
                                </p>
                            </div>
                            <div className={styles.infoBlock}>
                                <h3>
                                    How about Covid?
                                </h3>
                                <p>
                                    All fine. We got you covered with insurance provider
                                </p>
                            </div>
                            <div className={styles.infoBlock}>
                                <h3>
                                    I want to book for my entire team
                                </h3>
                                <p>
                                    Contact with Winding Tree. They will help
                                </p>
                            </div>
                        </Col>
                        <Col>
                            <div className={styles.infoBlock}>
                                <h3>
                                    Okay, how it works?
                                </h3>
                                <p>
                                    Local hotels in Bogotá agreed to offer exclusive prices here because they don’t need to pay for distribution that is decentralized. You got it
                                </p>
                                <p>
                                    So with a decentralized application they can save money on distribution cost, therefore lower the prices for travellers, and ultimately bring customer experience to a new level
                                </p>
                            </div>
                            <div className={styles.infoBlock}>
                                <h3>
                                    But wait... I’m travelling to Devcon, how can I not use my crypto?
                                </h3>
                                <p>
                                    Yes you can. You will even get additional discount
                                </p>
                                <p>
                                    Once you get down to payment, look out for Unicorns
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            }
            {!contactHidden &&
                <Container fluid={true}>
                    <div className={styles.iataBlock}>
                        <table>
                            <tr>
                                <td style={{width: '50px'}}>
                                    <div className={styles.logoBlack}></div>
                                </td>
                                <td>
                                    <div className={styles.iataLogo}></div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan='2' className={styles.iataCode}>
                                    Glider Travel IATA: #63320235
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className={styles.contactBlock}>
                        <h2>Contact</h2>
                        <p>
                            If you have any issues using this application get in touch with creators. The guys love feedback — <a alt='Click for feedback' href='mailto:hi@windingtree.com'>hi@windingtree.com</a>
                        </p>
                        <p>
                            Enjoy decentralized travel in collaboration with <a rel='noopener noreferrer' target='_blank' href='https://windingtree.com'>Winding Tree</a>
                        </p>
                    </div>
                    <div className={styles.wtLogoBlock}>
                    </div>
                </Container>
            }
        </>
    );
};

const mapStateToProps = state => ({
    infoHidden: isBookingStartedSelector(state)
});

export default connect(mapStateToProps, null)(Welcome);
