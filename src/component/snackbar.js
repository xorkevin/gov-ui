import React from 'react';

const Snackbar = ({show, children}) => {
  const k = ['snackbar'];
  if (!show) {
    k.push('hidden');
  }
  return (
    <div className={k.join(' ')}>
      <div className="inner">{children}</div>
    </div>
  );
};

export default Snackbar;
