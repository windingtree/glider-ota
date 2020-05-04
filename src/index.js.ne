import React from 'react'
import ReactDOM from 'react-dom'
import './styles/glider.scss'
import ComponentOne from "./pages/sandbox/component-one";
import ComponentTwo from "./pages/sandbox/component-two";


function Dispatcher() {
    return (<>
        <ComponentOne/>
        <ComponentTwo/>
        </>
    );
}

ReactDOM.render(<Dispatcher/>, document.getElementById('root'));
