import {h} from 'preact';

const Table = ({head, data, fullWidth}) => {
  const k = [];
  if (fullWidth) {
    k.push('full-width');
  }

  return (
    <table className={k.join(' ')}>
      {head && (
        <thead>
          <tr>
            {head.map(({key, component}) => {
              return <th key={key}>{component}</th>;
            })}
          </tr>
        </thead>
      )}
      {data && (
        <tbody>
          {data.map(({key, row}) => {
            return (
              <tr key={key}>
                {row.map(({key, component}) => {
                  return <td key={key}>{component}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      )}
    </table>
  );
};

export default Table;
