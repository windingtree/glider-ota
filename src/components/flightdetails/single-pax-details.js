import React, {useState} from 'react'
import {Container, Row, Col, Form, Alert} from 'react-bootstrap'
import _ from 'lodash'
import style from "./single-pax-details.module.scss";
const DEFAULT_PAXTYPE='ADT';

export default function SinglePaxDetails({passengerId, passengerType, onDataChange, initial}) {
    const [email, setEmail] = useState(initial?initial.email:undefined);
    const [phone, setPhone] = useState(initial?initial.phone:'s');
    const [firstName, setFirstname] = useState(initial?initial.firstName:'');
    const [lastName, setLastName] = useState(initial?initial.lastName:'');
    const [birthdate, setBirthdate] = useState(initial?initial.birthdate:'');

    function handleBlur() {
        onDataChange(passengerId,createPaxRecord());
    }

    function createPaxRecord() {
        return {
            id: passengerId,
            type: passengerType?passengerType:DEFAULT_PAXTYPE,
            email: email,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            birthdate: birthdate
        }
    }

    function handleSubmit() {
        // onDataChange();
    }

    let typeToLabel={
        ADT:'Adult',
        CHD:'Child',
        INF:'Infant'
    }
    let paxTypeLabel=typeToLabel[passengerType];
    if(!paxTypeLabel)
        paxTypeLabel=typeToLabel[DEFAULT_PAXTYPE];

    return (
        <>
                <div className={style.header}>{paxTypeLabel}</div>
                <Form.Row>
                    <Col>
                        <Form.Label className={style.label}>Surname</Form.Label>
                        <Form.Control type="text" placeholder="Lastname"
                                      name='lastname'
                                      onBlur={handleBlur}
                                      onChange={(e) => setLastName(e.target.value)}
                                      value={lastName}/>
                    </Col>
                    <Col>
                        <Form.Label className={style.label}>Name</Form.Label>
                        <Form.Control type="text" placeholder="Firstname"
                                      name='firstname'
                                      onBlur={handleBlur}
                                      value={firstName}
                                      onChange={(e) => setFirstname(e.target.value)}
                        />
                    </Col>

                </Form.Row>
                <Form.Row>
                    <Col>
                        <Form.Label className={style.label}>Date of birth</Form.Label>
                        <Form.Control type="date" className="input-birthdate" name='birthdate'
                                      value={birthdate}
                                      onChange={(e) => setBirthdate(e.target.value)} onBlur={handleBlur}/>
                    </Col>
                    <Col>
                        <Form.Label className={style.label}>Gender</Form.Label>
                        <Form.Control type="date" className="input-birthdate" name='gender'/>
                    </Col>
                </Form.Row>
                <div className={style.header}>Contact information</div>
                <div>
                    <Form.Row>
                        <Col>
                            <Form.Label className={style.label}>Email</Form.Label>
                            <Form.Control type="email" placeholder="email" name="email" value={email}
                                          onChange={(e) => setEmail(e.target.value)} onBlur={handleBlur}/>
                        </Col>
                        <Col>
                            <Form.Label className={style.label}>Telephone</Form.Label>
                            <Form.Control type="phone" placeholder="+7" name="phone" value={phone}
                                          onChange={(e) => setPhone(e.target.value)} onBlur={handleBlur}/>
                        </Col>
                    </Form.Row>
                </div>
        </>
    )
}
