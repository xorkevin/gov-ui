import React from 'react';

const ListItem = ({children}) => {
  const k = ['item'];

  return <div className={k.join(' ')}>{children}</div>;
};

const ListGroup = ({children}) => {
  const k = ['listgroup'];

  return <div className={k.join(' ')}>{children}</div>;
};

export {ListGroup, ListItem, ListGroup as default};
