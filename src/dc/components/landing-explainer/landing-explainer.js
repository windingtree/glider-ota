import React from 'react'
import style from './landing-explainer.module.scss';
import {Row, Col, Container} from 'react-bootstrap';
import { ReactComponent as EtherSymbol } from "../../../assets/ether.svg";

export const REASONS = [
    {
        title: "Why booking here?",
        description: "Shortly, you pay less and it's more fun.",
        image: "[IMAGE 1]",
    },
    {
        title: "How does it work?",
        description: "Prices are negotiated with local hotels",
        image: "[IMAGE 2]",
    },
    {
        title: "Okay! But wait... I’m travelling to Devcon, how can I not use my crypto?",
        description: "Yes you can. You will even get additional discount. Once you get down to payment, look out for Unicorns",
        image: "[IMAGE 3]",
    },
    {
        title: "How about COVID-19?",
        description: "All fine. We got you covered with insurance provider",
        image: "[IMAGE 4]",
    },
    {
        title: "I want to book for my entier team, I have special needs",
        description: "Contact us, we will get it sorted.",
        image: "[IMAGE 5]",
    }
];

function LandingExplainerRow({title, description, image}) {
    return (
    <Row>
        <Col><div className={style.floating}><EtherSymbol/></div></Col>
        <Col className={style.reasonRow}>
            <div className={style.reasonTitle}>{title}</div>
            <div className={style.reasonDetails}>{description}</div>
        </Col>
        <Col>{image}</Col>
    </Row>
    )
}

export function LandingExplainer({reasons}) {
    return (
        <Container>
            {(reasons || REASONS).map(reason => (
                <LandingExplainerRow 
                    title={reason.title}
                    description={reason.description}
                    image={reason.image}
                />
            ))}
        </Container>
    )
}