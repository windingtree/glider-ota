import React from 'react'
import {Button} from 'react-bootstrap'

export default function SearchButton({disabled,onSearchButtonClicked}) {
    return (<>
                        <Button className={'btn-block'} variant="outline-primary"  disabled={disabled} onClick={onSearchButtonClicked}>Search</Button>
        </>
    )
}
