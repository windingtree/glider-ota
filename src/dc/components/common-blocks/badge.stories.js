import React from 'react';
import {Badge} from "./badge"
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FaPlus, FaCheck} from "react-icons/fa";
export default {
    title: 'DC/common blocks/Badges',
    component: Badge
};

export const FewBadges = () => (<>
    <Badge text={'Devcon'}/>
    <Badge text={'Bogota'}/>
    <Badge text={'Devcon'}/>
    <Badge text={'Devcon'}/> </>
    )


export const InContainer = () => (<>
        <Container><Row>
            <Col xs={3}>ssss</Col>
            <Col xs={3}><Badge text={'Devcon'}/>
                <Badge text={'Bogota'}/></Col>
            <Col xs={3}>ssss</Col>
        </Row></Container>
        <Badge text={'Devcon'}/>
        <Badge text={'Bogota'}/>
        <Badge text={'Devcon'}/>
        <Badge text={'Devcon'}/> </>
)
export const WithIcon = () => (<>
        <Badge text={'Devcon'} icon={<FaPlus/>}/>
        <Badge text={'Devcon'}/> </>
)
