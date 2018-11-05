import {API} from 'config';
import {formatStr} from 'utility';
import {ReLogin} from 'reducer/account/auth';

const GetLinkGroup = (amount, offset) => {
  return async (dispatch) => {
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      return {
        err: 'Need to reauthenticate',
      };
    }
    try {
      const response = await fetch(
        formatStr(API.courier.link.get, amount, offset),
        {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
          //TODO: change to same-origin
          credentials: 'include',
        },
      );
      const status = response.status;
      const data = await response.json();
      if (status < 200 || status >= 300) {
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Unable to fetch link data');
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

export {GetLinkGroup};
