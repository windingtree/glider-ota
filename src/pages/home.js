import React from 'react';
import Header from '../components/common/header/header';
import Footer from '../components/common/footer/footer';
import ContentWrapper from '../components/common/content-wrapper';

export default function HomePage() {
    return (
        <>
            <Header/>
            <ContentWrapper>
                home
                <CustomTag param1={1} param2={2}/>
            </ContentWrapper>
            <Footer/>
        </>    )
}


class CustomTag extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        const {param1,param2} = this.props;
        return (
            <div>CustomTag param1={param1}</div>
        )
    }
}