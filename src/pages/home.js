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
            </ContentWrapper>
            <Footer/>
        </>    )
}
