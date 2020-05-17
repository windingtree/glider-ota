import React, {useState,useRef} from 'react'
import {Container, Row, Col, Form, Alert} from 'react-bootstrap'
import _ from 'lodash'
import style from "./single-pax-details.module.scss";
import Button from "react-bootstrap/Button";
const DEFAULT_PAXTYPE='ADT';

export default function SinglePaxDetails({passengerId, passengerType, onDataChange, initial, showSubmitButton, onSubmit}) {
    const formRef = useRef(null);
    const [fieldValues, setFieldValues] = useState({
        id: passengerId,
        type: passengerType?passengerType:DEFAULT_PAXTYPE,
        email: initial?initial.email:undefined,
        phone: initial?initial.phone:undefined,
        firstName: initial?initial.firstName:undefined,
        lastName: initial?initial.lastName:undefined,
        birthdate: initial?initial.birthdate:undefined,
        gender: initial?initial.gender:undefined
    })

    const [fieldIsInvalidFlags, setFieldIsInvalidFlags] = useState({
        firstname:false,
        lastname:false,
        birthdate:false,
        email:false,
        phone:false,
        gender:false
    })
    const [validated, setValidated] = useState(false);
    const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

    function handleBlur(e) {
        const {name,value} = e.target;
        console.log(`onBlur field:${name} value:${value}`)
        let copy = {...fieldIsInvalidFlags};
        copy[name] = !e.target.checkValidity();
        setFieldIsInvalidFlags(copy);
        console.log("Ref",formRef.current)
        console.log("checkValidity",)
        setSaveButtonEnabled(formRef.current.checkValidity())
        if(formRef.current.checkValidity())
            onDataChange(passengerId,fieldValues);
    }

    function onChange(e) {
        const {name,value} = e.target;
        console.log(`onChange field:${name} value:${value}`)
        let copy = {...fieldValues};
        copy[name] = value;
        setFieldValues(copy);
        // onDataChange(passengerId,createPaxRecord());
    }



    function handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    }
    function onInput(e){
        const {name,value} = e.target;
        console.log(`onInput field:${name} value:${value}`)
    }

    function onSaveClicked(){
        console.log("Save clicked")
        onSubmit(fieldValues)
    }

    let typeToLabel={
        ADT:'Adult',
        CHD:'Child',
        INF:'Infant'
    }
    let paxTypeLabel=typeToLabel[passengerType];
    if(!paxTypeLabel)
        paxTypeLabel=typeToLabel[DEFAULT_PAXTYPE];


    console.log("Initial pax:", fieldValues)


    return (
        <>
                <div className={style.header}>{paxTypeLabel}</div>
            <Form validated={validated} onSubmit={handleSubmit} ref={formRef}>
                <Form.Row className={style.paxDetailsFormRow}>
                    <Col>
                        <Form.Label className={style.label}>Surname</Form.Label>
                        <Form.Control type="text" placeholder="Lastname"
                                      name='lastName'
                                      onBlur={handleBlur}
                                      onChange={onChange}
                                      value={fieldValues['lastName']}
                                      required
                                      isInvalid={fieldIsInvalidFlags['lastName']}
                                        onInput={onInput}/>
                    </Col>
                    <Col>
                        <Form.Label className={style.label}>Name</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Firstname"
                                      name='firstName'
                                      onBlur={handleBlur}
                                      value={fieldValues['firstName']}
                                      onChange={onChange}
                                      onInput={onInput}
                                      isInvalid={fieldIsInvalidFlags['firstName']}
                                      required
                        />
                    </Col>

                </Form.Row>
                <Form.Row>
                    <Col>
                        <Form.Label className={style.label}>Date of birth</Form.Label>
                        <Form.Control type="date"
                                      className="input-birthdate"
                                      name='birthdate'
                                      value={fieldValues['birthdate']}
                                      onBlur={handleBlur}
                                      onChange={onChange}
                                      isInvalid={fieldIsInvalidFlags['birthdate']}

                                      onInput={onInput} required/>

                    </Col>
                    <Col>
                        <Form.Label className={style.label}>Gender</Form.Label>
                            <Form.Control as="select"
                                          name='gender'
                                          value={fieldValues['gender']}
                                          onBlur={handleBlur}
                                          onChange={onChange}
                                          onInput={onInput} r
                                          isInvalid={fieldIsInvalidFlags['gender']}
                                          required>
                                <option value=''></option>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                            </Form.Control>
                    </Col>
                </Form.Row>
                <div className={style.header}>Contact information</div>
                <div>
                    <Form.Row>
                        <Col>
                            <Form.Label className={style.label}>Email</Form.Label>
                            <Form.Control type="email"
                                          placeholder="email"
                                          name="email"
                                          value={fieldValues['email']}
                                          onChange={onChange}
                                          onBlur={handleBlur}
                                          isInvalid={fieldIsInvalidFlags['email']}
                                          onInput={onInput} required/>
                        </Col>
                        <Col>
                            <Form.Label className={style.label}>Telephone</Form.Label>
                            <Form.Control type="phone"
                                          placeholder="+12 3456789"
                                          name="phone"
                                          value={fieldValues['phone']}
                                          onChange={onChange}
                                          onBlur={handleBlur}
                                          isInvalid={fieldIsInvalidFlags['phone']}
                                          onInput={onInput} required/>
                        </Col>
                    </Form.Row>
                </div>
                {showSubmitButton &&
                <div className='py-3'>
                    <Button disabled={!saveButtonEnabled} onClick={onSaveClicked} variant='primary' size={"lg"}>Save</Button>
                </div>
                }
            </Form>
        </>
    )
}
