import React from 'react';
import Container from 'component/container';

const Footer = ({withSidebar, children}) => {
  const k = [];
  if (withSidebar) {
    k.push('with-sidebar');
  }

  return (
    <footer className={k.join(' ')}>
      <Container padded narrow>
        {children}
      </Container>
    </footer>
  );
};

export default Footer;
