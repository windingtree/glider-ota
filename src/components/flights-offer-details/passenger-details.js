import React  from 'react'
import {Container, Row,Col, Form, Alert} from 'react-bootstrap'
import _ from 'lodash'

export default class PassengersDetailsForm extends React.Component {
    constructor(props) {
        super(props);
        const {passengers} = props;

        let initialState = {
            email: '',
            phone: ''
        }
        _.map(passengers, (pax, id) => {
            initialState[id] = {
                firstname: '',
                lastname: '',
                birthdate: '',
            }
        })

        this.state=(initialState);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleBlur(event) {
        if(this.props.onDataChange!==undefined){
            this.props.onDataChange(this.state);
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        let paxId;
        let fieldName;
        //if fieldname is prefixed with paxID (e.g. PAX1.lastname), set value for appropriate passenger
        if(name.indexOf('.')!==-1){
            paxId=name.split('.')[0]
            fieldName=name.split('.')[1]
        }else{
            fieldName=name;
        }
        let s=this.state;

        if(paxId!==undefined)
            s[paxId][fieldName]=value;
        else
            s[fieldName]=value;
        this.setState(s)

    }


    render() {
        const {passengers} = this.props;

        return (
            <Form onSubmit={this.handleSubmit}>
                <Container>
                    <Row>
                        <Col>
                            <h2>Passengers for reservation</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            Enter your personal details as indicated in the travel document you are flying on. Use Latin letters.
                            <div>
                                <small>The number and type of passengers for this airline can only be changed with a new search
                                </small>
                            </div>
                        </Col>
                    </Row>
                    {
                        _.map(passengers,(pax,id)=>{

                            return (
                                <Row key={id}>
                                    <Col>
                                        <h5>Adult {this.state[id].firstname} {this.state[id].lastname}</h5>
                                        <Form.Row>
                                            <Col>
                                                <Form.Label>Surname</Form.Label>
                                                <Form.Control type="text" placeholder="Lastname" name={id+'.lastname'} value={this.state[id].lastname}
                                                              onChange={this.handleInputChange} onBlur={this.handleBlur}/>
                                            </Col>
                                            <Col>
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control type="text" placeholder="Firstname" name={id+'.firstname'} value={this.state[id].firstname}
                                                              onChange={this.handleInputChange} onBlur={this.handleBlur}/>
                                            </Col>
                                        </Form.Row>
                                        <Form.Row>
                                            <Col>
                                                <Form.Label>Date of birth</Form.Label>
                                                <Form.Control type="date" className="input-birthdate" name={id+'.birthdate'}
                                                              value={this.state[id].birthdate}
                                                              onChange={this.handleInputChange} onBlur={this.handleBlur}/>
                                            </Col>
                                        </Form.Row>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                    <Row>
                        <Col>
                            <Alert variant="dark">
                                This website doesn’t store any personal data you may enter while booking. All passeneger’s information and  buyer’s contact data is securely passed to supplier
                            </Alert>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <h2>Contact details</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>

                            <Form.Row>
                                <Col>
                                    <Form.Label>Email {this.state.email}</Form.Label>
                                    <Form.Control type="email" placeholder="email" name="email" value={this.state.email}
                                                  onChange={this.handleInputChange} onBlur={this.handleBlur}/>
                                </Col>
                                <Col>
                                    <Form.Label>Telephone</Form.Label>
                                    <Form.Control type="phone" placeholder="+7" name="phone" value={this.state.phone}
                                                  onChange={this.handleInputChange} onBlur={this.handleBlur}/>
                                </Col>
                            </Form.Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            We will send a ticket to the ail, we will send an SMS to the phone about changes in the flight or in case of other emergency situations
                        </Col>
                    </Row>
                </Container>
            </Form>
        )
    }
}
