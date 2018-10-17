import {API} from 'config';

const CreateAccountReq = (options) => {
  return async (dispatch) => {
    try {
      const response = await fetch(API.u.user.new, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(options),
      });
      const status = response.status;
      const data = await response.json();
      if (status >= 200 && status < 300) {
        return {
          err: false,
          res: data,
        };
      } else if (data && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error('Could not create account');
      }
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

const ConfirmAccountReq = (key) => {
  return async (dispatch) => {
    try {
      const response = await fetch(API.u.user.confirm, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key}),
      });
      const status = response.status;
      const data = await response.json();
      if (status >= 200 && status < 300) {
        return {
          err: false,
          res: data,
        };
      } else if (data && data.message) {
        throw new Error(data.message);
      } else {
        throw new Error('Could not create account');
      }
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

export {CreateAccountReq, ConfirmAccountReq};
