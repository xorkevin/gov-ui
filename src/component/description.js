import React from 'react';

const Description = ({label, item}) => {
  return (
    <dl className="description-item">
      <dt className="label">{label}</dt>
      <dd className="item">{item}</dd>
    </dl>
  );
};

export default Description;
