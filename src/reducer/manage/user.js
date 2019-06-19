import {API} from 'config';
import {formatStr} from 'utility';
import {ReLogin} from 'reducer/auth';

const PatchRank = (userid, rank) => {
  return async (dispatch) => {
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      return {
        err: 'Need to reauthenticate',
      };
    }
    try {
      const response = await fetch(formatStr(API.u.user.rank, userid), {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
        body: JSON.stringify(rank),
      });
      const status = response.status;
      if (status < 200 || status >= 300) {
        const data = await response.json();
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Unable to fetch user data');
        }
      }

      return {
        err: false,
      };
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

export {PatchRank};
