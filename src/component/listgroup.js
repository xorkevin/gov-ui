import React from 'react';

const ListItem = ({children}) => {
  const k = ['item'];

  return <div className={k.join(' ')}>{children}</div>;
};

const ListGroup = ({size, children}) => {
  const k = ['listgroup'];
  switch (size) {
    case 'sm':
    case 'md':
    case 'lg':
      k.push(size);
  }

  return <div className={k.join(' ')}>{children}</div>;
};

export {ListGroup, ListItem, ListGroup as default};
