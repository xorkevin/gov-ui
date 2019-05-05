import React from 'react';
import Container from 'component/container';

const Section = ({
  id,
  container,
  padded,
  narrow,
  sectionTitle,
  subsection,
  children,
}) => {
  const k = [];
  let headingClass = 'h3';
  if (subsection) {
    k.push('subsection');
    headingClass = 'h5';
  }

  let titleElement = false;

  if (sectionTitle) {
    titleElement = (
      <div className="section-header">
        {React.createElement(headingClass, {}, sectionTitle)}
      </div>
    );
  }

  if (container) {
    return (
      <section id={id} className={k.join(' ')}>
        <Container padded={padded} narrow={narrow}>
          {titleElement}
          {children}
        </Container>
      </section>
    );
  }

  return (
    <section id={id} className={k.join(' ')}>
      {titleElement}
      {children}
    </section>
  );
};

export default Section;
