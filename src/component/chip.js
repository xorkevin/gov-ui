import React from 'react';

const Chip = ({primary, children}) => {
  const k = ['chip'];
  if (primary) {
    k.push('primary');
  }

  return <span className={k.join(' ')}>{children}</span>;
};

export default Chip;
