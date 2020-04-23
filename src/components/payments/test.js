import React, {useState} from 'react';
import {Button, Container, Row, Col} from "react-bootstrap";
import { withRouter } from 'react-router'


 class TestHistory extends React.Component{

    constructor(props) {
        super(props);
        console.log("props",this.props);
        console.log("props.history",this.props.history);
        this.redirect=this.redirect.bind(this)
    }


    redirect(){
        console.log("Redir")
        this.props.history.push('/contact')
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Button onClick={this.redirect}>Click me</Button>
                    </Col>
                </Row>
            </Container>
        )
    }
}


TestHistory = withRouter(TestHistory)
export default TestHistory;