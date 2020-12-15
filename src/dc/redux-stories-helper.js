import {Provider} from "react-redux";
import React from "react";

import configuredStore from "../redux/store"

export const ProviderWrapper = ({ children}) => (
    <Provider store={configuredStore}>
        { children }
    </Provider>
)

