import React from 'react';

const DefaultGovValue = Object.freeze({
  homePath: '/',
  courierPath: '/link',
});
const GovContext = React.createContext(DefaultGovValue);

export {GovContext as default, GovContext};
