import React from 'react'

export default class ErrorCatcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error('Error occurred, error:', error, 'errorInfo:',errorInfo)
    }


    render() {
        if (this.state.hasError) {
            return <h3>Something went wrong - please try again.</h3>;
        }
        return this.props.children;
    }
}

