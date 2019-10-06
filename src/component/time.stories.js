import React from 'react';
import Time from 'component/time';

export default {title: 'Time'};

export const plain = () => <Time value={Date.now() - 86400000} />;
