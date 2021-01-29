import React, {useEffect} from 'react';
import {invalidateCache} from "../../utils/api-utils";


export const SessionInvalidator = () => {
    useEffect(() => {
        console.log('session will be invalidated')
        invalidateCache()
            .then(() => {
                console.log('Session invalidated')
            })
            .catch(err => {
                console.log('Failure while invalidating session', err)
            })
    }, [])
    return (<>

        </>
    );
}

