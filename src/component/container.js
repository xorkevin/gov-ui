import React from 'react';

const Container = ({padded, narrow, children}) => {
  const k = ['container'];
  if (padded) {
    k.push('padded');
  }

  if (narrow) {
    k.push('narrow');
  }

  return <div className={k.join(' ')}>{children}</div>;
};

export default Container;
