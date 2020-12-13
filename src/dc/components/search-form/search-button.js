import React from 'react'
import {Button, Row, Col} from 'react-bootstrap'
import style from './search-button.module.scss'

export default function SearchButton({disabled,onSearchButtonClicked}) {
    return (<>
                        <Button className={'btn-block'} variant="primary"  disabled={disabled} onClick={onSearchButtonClicked}>Search</Button>
        </>
    )
}
