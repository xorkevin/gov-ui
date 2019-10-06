import React from 'react';
import Section from 'component/section';

export default {title: 'Section'};

export const plain = () => (
  <Section sectionTitle="Section title">section content</Section>
);

export const subsection = () => (
  <Section sectionTitle="Section title" subsection>
    section content
  </Section>
);
