import React, { useEffect, useState } from 'react'
import { useRouteMatch } from 'react-router-dom';
import DevConLayout from '../components/layout/devcon-layout';
import ReactMarkdown from 'react-markdown'

// Content
import faqMarkdown from './faq.md';
import termsAndConditionsMarkdown from './terms-and-conditions.md';
import privacyPolicyMarkdown from './privacy-policy.md';

export default function MarkdownPage() {
  const match = useRouteMatch();
  let markdownContent = null;

  if (match.path === '/faq') {
    markdownContent = faqMarkdown;
  } else if (match.path === '/terms-of-service') {
    markdownContent = termsAndConditionsMarkdown;
  } else if (match.path === '/privacy-policy') {
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
