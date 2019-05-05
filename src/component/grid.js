import React from 'react';

const Grid = ({
  strict,
  center,
  verticalCenter,
  horizontalCenter,
  xs,
  sm,
  md,
  lg,
  map,
  children,
}) => {
  const k = ['grid'];
  if (strict) {
    k.push('strict');
  }

  if (center) {
    k.push('vertical-center');
    k.push('horizontal-center');
  }

  if (verticalCenter) {
    k.push('vertical-center');
  }
  if (horizontalCenter) {
    k.push('horizontal-center');
  }

  const childProps = {
    xs,
    sm,
    md,
    lg,
  };

  return (
    <div className={k.join(' ')}>
      {map &&
        React.Children.map(children, (child) => {
          let key = '';
          if (child && child.attributes && child.attributes.colkey) {
            key = child.attributes.colkey;
          } else if (typeof child === 'string') {
            key = child;
          }
          return (
            <Column key={key} {...childProps}>
              {child}
            </Column>
          );
        })}
      {!map && children}
    </div>
  );
};

const switchSize = (prefix, number) => {
  if (number < 1) {
    return prefix + '-1';
  } else if (number > 24) {
    return prefix + '-24';
  }
  return prefix + '-' + number;
};

const Column = ({xs, sm, md, lg, children}) => {
  const k = ['col'];
  if (xs) {
    k.push(switchSize('xs', xs));
  }
  if (sm) {
    k.push(switchSize('sm', sm));
  }
  if (md) {
    k.push(switchSize('md', md));
  }
  if (lg) {
    k.push(switchSize('lg', lg));
  }

  return <div className={k.join(' ')}>{children}</div>;
};

export {Grid, Column};

export default Grid;
