import {API} from 'config';

const SetupReq = (options) => {
  return async (dispatch) => {
    try {
      const response = await fetch(API.setupz, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(options),
      });
      const status = response.status;
      const data = await response.json();
      if (status < 200 || status >= 300) {
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Could not setup server');
        }
      }
      return {
        data,
        err: false,
      };
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

export {SetupReq};
