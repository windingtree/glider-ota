import React from 'react';
import {UnicornBadge} from "./unicorn-badge"
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FaPlus, FaCheck} from "react-icons/fa";
import ArrowIcon from '../../../assets/arrow-up-right.svg';

export default {
    title: 'common blocks/Badges',
    component: UnicornBadge
};

export const FewBadges = () => (<>
        <UnicornBadge>DevCon</UnicornBadge>
        <UnicornBadge>DevCon</UnicornBadge>
        <UnicornBadge>DevCon</UnicornBadge>
    </>
    )


export const InContainer = () => (<>
        <Container><Row>
            <Col xs={3}>ssss</Col>
            <Col xs={3}><UnicornBadge>In a col</UnicornBadge>
                </Col>
            <Col xs={3}>ssss</Col>
        </Row></Container>
        <UnicornBadge>outside of col</UnicornBadge>
</>
)
export const WithIcon = () => (<>
        <UnicornBadge>With icon <FaPlus className={{'height':'5px'}}/></UnicornBadge>
        </>
)
