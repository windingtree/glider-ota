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
        civility: initial?initial.civility:undefined
    })

    const [fieldIsInvalidFlags, setFieldIsInvalidFlags] = useState({
        firstName:false,
        lastName:false,
        birthdate:false,
        email:false,
        phone:false,
        civility:false
    })
    const [validated, setValidated] = useState(false);
    const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);

    function onFieldBlur(e) {
        const {name,value} = e.target;
        let copy = {...fieldIsInvalidFlags};
        copy[name] = !e.target.checkValidity();
        setFieldIsInvalidFlags(copy);
        setSaveButtonEnabled(formRef.current.checkValidity())
        onDataChange(passengerId,fieldValues,formRef.current.checkValidity());
    }

    function onFieldValueChanged(e) {
        const {name,value} = e.target;
        let copy = {...fieldValues};
        copy[name] = value;
        setFieldValues(copy);
    }

    function handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    }
    function onFieldInput(e){
        const {name,value} = e.target;
    }

    function onSaveButtonClicked(){
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

    return (
        <>
                <div className={style.header}>{paxTypeLabel}</div>

            <Form validated={validated} onSubmit={handleSubmit} ref={formRef}>
                <Form.Row className={style.paxDetailsFormRow}>
                    <Col>
                        <Form.Label className={style.label}>Surname</Form.Label>
                        <Form.Control type="text" placeholder="Lastname"
                                      name='lastName'
                                      onBlur={onFieldBlur}
                                      onChange={onFieldValueChanged}
                                      value={fieldValues['lastName']}
                                      required
                                      isInvalid={fieldIsInvalidFlags['lastName']}
                                        onInput={onFieldInput}/>
                    </Col>
                    <Col>
                        <Form.Label className={style.label}>Name</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Firstname"
                                      name='firstName'
                                      onBlur={onFieldBlur}
                                      value={fieldValues['firstName']}
                                      onChange={onFieldValueChanged}
                                      onInput={onFieldInput}
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
                                      onBlur={onFieldBlur}
                                      onChange={onFieldValueChanged}
                                      isInvalid={fieldIsInvalidFlags['birthdate']}
                                      onInput={onFieldInput} required/>

                    </Col>
                    <Col>
                        <Form.Label className={style.label}>Gender</Form.Label>
                            <Form.Control as="select"
                                          name='civility'
                                          value={fieldValues['civility']}
                                          onBlur={onFieldBlur}
                                          onChange={onFieldValueChanged}
                                          onInput={onFieldInput}
                                          isInvalid={fieldIsInvalidFlags['civility']}
                                          required>
                                <option value=''></option>
                                <option value='MR'>Male</option>
                                <option value='MRS'>Female</option>
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
                                          onChange={onFieldValueChanged}
                                          onBlur={onFieldBlur}
                                          isInvalid={fieldIsInvalidFlags['email']}
                                          onInput={onFieldInput} required/>
                        </Col>
                        <Col>
                            <Form.Label className={style.label}>Telephone</Form.Label>
                            <Form.Control type="phone"
                                          placeholder="+12 3456789"
                                          name="phone"
                                          value={fieldValues['phone']}
                                          onChange={onFieldValueChanged}
                                          onBlur={onFieldBlur}
                                          isInvalid={fieldIsInvalidFlags['phone']}
                                          onInput={onFieldInput} required/>
                        </Col>
                    </Form.Row>
                </div>
                {showSubmitButton &&
                <div className='py-3'>
                    <Button disabled={!saveButtonEnabled} onClick={onSaveButtonClicked} variant='primary' size={"lg"}>Save</Button>
                </div>
                }
            </Form>
        </>
    )
}
