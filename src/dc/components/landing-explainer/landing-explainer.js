import React from 'react'
import style from './landing-explainer.module.scss';
import {Row, Col, Container} from 'react-bootstrap';
import { ReactComponent as EtherSymbol } from "../../../assets/ether.svg";

const MAIN_REASON = {
    title: "Yes, we have just decentralized the Travel",
    description: "Here you can book airlines and hotels directly so that your payment goes to the travel provider and not to gatekeepers taking commissions. There are no gatekeepers, no hidden fees, no data selling. Only technologies and smart contracts that do their jobs. 100% fair-trade travel booking platform is here",
};

const REASONS_LEFT = [
    {
        title: "Why booking here?",
        description: "Shortly, you pay less and it's more fun.",
    },
    {
        title: "How does it work?",
        description: "Prices are negotiated with local hotels",
    },
    {
        title: "Okay! But wait... I’m travelling to Devcon, how can I not use my crypto?",
        description: "Yes you can. You will even get additional discount. Once you get down to payment, look out for Unicorns",
    },
];

const REASONS_RIGHT = [
    {
        title: "How about COVID-19?",
        description: "All fine. We got you covered with insurance provider",
    },
    {
        title: "I want to book for my entier team, I have special needs",
        description: "Contact us, we will get it sorted.",
    }
];

function LandingExplainerRow({title, description}) {
    return (
    <Row>
        <div className={style.reasonTitle}>{title}</div>
        <div className={style.reasonDetails}>{description}</div>
    </Row>
    )
}

export function LandingExplainer({reasons}) {
    return (
        <Container className={style.explainerContainer}>
            <Row>
                <div className={style.mainReasonTitle}>{MAIN_REASON.title}</div>
                <div className={style.mainReasonDetails}>{MAIN_REASON.description}</div>
            </Row>
            <Row>
                <Col>
                    {REASONS_LEFT.map(reason => (
                        <LandingExplainerRow 
                            title={reason.title}
                            description={reason.description}
                            image={reason.image}
                        />
                    ))}
                </Col>
                <Col>
                    {REASONS_RIGHT.map(reason => (
                        <LandingExplainerRow 
                            title={reason.title}
                            description={reason.description}
                            image={reason.image}
                        />
                    ))}
                </Col>
            </Row>

        </Container>
    )
}