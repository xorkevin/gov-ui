import React from 'react';
import Container from 'component/container';

const Tabbar = ({left, right, children}) => {
  const className = ['tabbar'];
  return (
    <div className={className.join(' ')}>
      <Container>
        <div className="element">{left}</div>
        {children && <div className="element">{children}</div>}
        <div className="element">{right}</div>
      </Container>
    </div>
  );
};

export default Tabbar;
