import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom';
import DevConLayout from '../components/layout/devcon-layout';
import style from "./markdown-page.scss";
import ReactMarkdown from 'react-markdown'

// Content
import faqMarkdown from './faq.md';
import termsAndConditionsMarkdown from './terms-and-conditions.md';
import privacyPolicyMarkdown from './privacy-policy.md';

export default function MarkdownPage() {
  const match = useRouteMatch();
  let markdownContent = null;

  if (match.path === '/dc/faq') {
    markdownContent = faqMarkdown;
  } else if (match.path === '/dc/terms-of-service') {
    markdownContent = termsAndConditionsMarkdown;
  } else if (match.path === '/dc/privacy-policy') {
    markdownContent = privacyPolicyMarkdown;
  }

  const [pageContent, setPageContent] = useState({});

  useEffect(() => {
   fetch(markdownContent).then((response) => response.text()).then(text =>
     setPageContent(text)
   );
  }, [])

  return (
    <DevConLayout pageClass="MarkdownPage">
      {typeof pageContent === 'string' &&
        <ReactMarkdown source={pageContent} />
      }
    </DevConLayout>
  );
}
