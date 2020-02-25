import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

function App() {
    return (
        <div>Glider OTA</div>
    )
}

ReactDOM.render(<App />, document.getElementById('root'));
serviceWorker.unregister();
