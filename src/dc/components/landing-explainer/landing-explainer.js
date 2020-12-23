import React from 'react'
import style from './landing-explainer.module.scss';
import {Row, Col, Container} from 'react-bootstrap';

const MAIN_REASON = {
    title: "Yes, we have just decentralized the Travel",
    description: 
        <span>
            <p>Here you can book airlines and hotels directly so that your payment goes to the travel provider and not to gatekeepers taking commissions.</p>
            <p>There are no gatekeepers, no hidden fees, no data selling. Only technologies and smart contracts that do their jobs.</p>
            <p>100% fair-trade travel booking platform is here</p>
        </span>,
};

const REASONS_LEFT = [
    {
        title: "Why booking here?",
        description: "Shortly, you pay less and it's more fun.",
    },
    {
        title: "Really? What’s the trick?",
        description: 
            <span>
                <p>No trick, this is a decentralized aplication so you can book flights and hotels without intermediary humans between you and the travel</p>
                <p>Algorithms were already fully capable of connecting you with thousands of travel suppliers at the same time. But those algorithms serve their owners more than customers</p>
                <p>Now, blockhain enables airlines, hotels and other travel suppliers of any size to join the marketplace without paying crazy distribution fees to online agents</p>
            </span>,
    },
    {
        title: "Okay, how does it work?",
        description:
            <span>
                <p>Local hotels in Bogotá agreed to offer exclusive prices here because they don’t need to pay for distribution that is decentralized. You got it</p>
                <p>So with a decentralized application they can save money on distribution cost, therefore lower the prices for travellers, and ultimately bring customer experience to a new level</p>
            </span>
        ,
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
        description: "Contact hi@windingtree.com, we will get it sorted.",
    },
    {
        title: "Why is my favorite airline or hotel missing?",
        description:
        <span>
            <p>We don't have connectivity to all travel suppliers in the world yet!</p>
            <p>For airlines, only Air Canada is direct and 80+ airlines are available through an aggregator</p>
            <p>We have secured direct negotiated rates with 14 Hotels in Bogotá, about 900 rooms</p>
            <p>Know an airline or an hotel? Tell them about Winding Tree!</p>
        </span>,
    },
    {
        title: "How does the refund work?",
        description:
        <span>
            <p>Crypto-payments are refunded based on the ticket value in fiat on the original address that made the payment. You can decide to receive the USDC amount or the equivalent amount in your crypto, but this can be different from the amount you paid.</p>
            <p>Credit Cards are refunded on the original one.</p>
            <p>Initiate a refund request by contacting hi@windingtree.com.</p>
        </span>,
    }
];

function LandingExplainerRow({title, description}) {
    return (
    <Row className={style.reasonRow}>
        <div className={style.reasonTitle}>{title}</div>
        <div className={style.reasonDetails}>{description}</div>
    </Row>
    )
}

export function LandingExplainer() {
    return (
        <Container fluid="md" className={style.explainerContainer}>
            <Row className={style.mainReasonRow}>
                <div className={style.mainReasonTitle}>{MAIN_REASON.title}</div>
                <div className={style.mainReasonDetails}>{MAIN_REASON.description}</div>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    {REASONS_LEFT.map(reason => (
                        <LandingExplainerRow 
                            title={reason.title}
                            description={reason.description}
                            image={reason.image}
                        />
                    ))}
                </Col>
                <Col xs={12} md={6}>
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