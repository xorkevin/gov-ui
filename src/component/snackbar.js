import React from 'react';

const Snackbar = ({show, children}) => {
  return (
    <div className="snackbar">
      <div className="inner">{children}</div>
    </div>
  );
};

export default Snackbar;
