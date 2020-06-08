import React, {useState, useRef} from 'react'
import {Container, Row, Col, Form, Alert} from 'react-bootstrap'
import _ from 'lodash'
import style from "./single-pax-details.module.scss";
import Button from "react-bootstrap/Button";
import 'react-phone-number-input/style.css';
import PhoneInput, {isPossiblePhoneNumber} from 'react-phone-number-input';
const DEFAULT_PAXTYPE='ADT';




export default function SinglePaxDetails({passengerId, passengerType, onDataChange, initial, showSubmitButton, onSubmit}) {
    const formRef = useRef(null);
    const phoneRef = useRef(null);

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
        firstName:undefined,
        lastName:undefined,
        birthdate:undefined,
        email:undefined,
        phone:undefined,
        civility:undefined
    });
    const [validated, setValidated] = useState(false);
    const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
    const [highlightInvalidFields, setHighlightInvalidFields] = useState(false);

    // Function to determine if all fields are valid
    const allFieldsValid = () => {
        return Object.keys(fieldIsInvalidFlags).reduce((valid, key) => {
            return valid && (key===false);
        }, true);
    };

    // FUnction to determine if the invalid status should be shown
    const showInvalidStatus = (key) => {
        // If fields are not yet touched, don't show the invalid status
        if(highlightInvalidFields) {
            return (fieldIsInvalidFlags[key] === undefined) || fieldIsInvalidFlags[key];
        }

        // Otherwise return the flag
        return (fieldIsInvalidFlags[key]===true);


    }

    function onFieldBlur(e) {
        const {name,value} = e.target;
        let newInvalidFlags = {...fieldIsInvalidFlags};
        newInvalidFlags[name] = !e.target.checkValidity();
        if(name==='phone') {
            newInvalidFlags[name] = newInvalidFlags[name] || !isPossiblePhoneNumber(value);
        }
        const isFormValid = Object.keys(newInvalidFlags).reduce((valid, key) => {
            return valid && !newInvalidFlags[key];
        }, true);
        setFieldIsInvalidFlags(newInvalidFlags);
        setSaveButtonEnabled(isFormValid)
        onDataChange(passengerId,fieldValues,isFormValid);
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
        if(allFieldsValid()) {
            onSubmit(fieldValues);
        }
        else {
            setHighlightInvalidFields(true);
        }
    }

    let typeToLabel={
        ADT:'Adult',
        CHD:'Child',
        INF:'Infant'
    }
    let paxTypeLabel=typeToLabel[passengerType];
    if(!paxTypeLabel) {
        paxTypeLabel=typeToLabel[DEFAULT_PAXTYPE];
    }

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
                                      isInvalid={showInvalidStatus('lastName')}
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
                                      isInvalid={showInvalidStatus('firstName')}
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
                                      isInvalid={showInvalidStatus('birthdate')}
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
                                          isInvalid={showInvalidStatus('civility')}
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
                                          isInvalid={showInvalidStatus('email')}
                                          onInput={onFieldInput} required/>
                        </Col>
                        <Col>
                            <Form.Label className={style.label}>Telephone</Form.Label>
                            <PhoneInput
                                ref={phoneRef}
                                international
                                placeholder="Enter phone number"
                                value={fieldValues['phone']}
                                onChange={(value) => {
                                    onFieldValueChanged({
                                        target: {
                                            name: 'phone',
                                            value: value,
                                        },
                                    });
                                }}
                                name="phone"
                                onBlur={onFieldBlur}
                                isInvalid={showInvalidStatus('phone')}
                                inputComponent={PhoneInputComponent}
                                required
                            />
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
    );
}


// Define a custom phone input component using react bootstrap control
// Author's reference code: https://codesandbox.io/s/zealous-chatterjee-8c5mm?file=/src/App.js
let PhoneInputComponent = (props, ref) => <Form.Control ref={ref} {...props}/>
PhoneInputComponent = React.forwardRef(PhoneInputComponent);