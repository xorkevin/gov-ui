import React from 'react';

const Table = ({head, children, fullWidth}) => {
  const k = [];
  if (fullWidth) {
    k.push('full-width');
  }

  return (
    <table className={k.join(' ')}>
      {head && (
        <thead>
          <tr>{head}</tr>
        </thead>
      )}
      {children && <tbody>{children}</tbody>}
    </table>
  );
};

export default Table;
