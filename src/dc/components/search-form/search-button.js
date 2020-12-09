import React from 'react'
import {Button, Row, Col} from 'react-bootstrap'
import style from './search-button.module.scss'

export default function SearchButton({disabled,onSearchButtonClicked}) {
    return (<>
            <div className={style.searchButtonContainer}>
                <Row>
                    <Col xs={12} className='d-flex'>
                        <Button className={style.searchButton} variant="primary"  disabled={disabled} onClick={onSearchButtonClicked}>Search</Button>
                    </Col>
                </Row>
            </div>
        </>
    )
}
