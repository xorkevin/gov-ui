import {API} from 'config';

const ForgotPasswordReq = (username) => {
  return async (dispatch) => {
    try {
      const response = await fetch(API.u.user.password.forgot, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username}),
      });
      const status = response.status;
      if (status >= 200 && status < 300) {
        return {
          err: false,
        };
      } else {
        const data = await response.json();
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Could not reset password');
        }
      }
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

const ConfirmResetReq = (key, new_password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(API.u.user.password.confirm, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key, new_password}),
      });
      const status = response.status;
      if (status >= 200 && status < 300) {
        return {
          err: false,
        };
      } else {
        const data = await response.json();
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Could not reset password');
        }
      }
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

export {ForgotPasswordReq, ConfirmResetReq};
