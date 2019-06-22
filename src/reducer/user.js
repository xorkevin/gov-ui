import {API} from 'config';
import {formatStr} from 'utility';
import {ReLogin} from 'service/auth';

const GetProfile = (userid) => {
  return async (dispatch) => {
    try {
      const response = await fetch(formatStr(API.profile.id, userid), {
        method: 'GET',
      });
      const status = response.status;
      const data = await response.json();
      if (status < 200 || status >= 300) {
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Unable to fetch profile data');
        }
      }
      return {
        err: false,
        data,
      };
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

const GetUserByName = (username) => {
  return async (dispatch) => {
    try {
      const response = await fetch(formatStr(API.u.user.name, username), {
        method: 'GET',
      });
      const status = response.status;
      const data = await response.json();
      if (status < 200 || status >= 300) {
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Unable to fetch user data');
        }
      }
      data.creation_time *= 1000;

      const {err: profileErr, data: profile} = await dispatch(
        GetProfile(data.userid),
      );
      if (!profileErr) {
        Object.assign(data, profile);
      }

      return {
        err: false,
        profileErr,
        data,
      };
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

const GetUserByID = (userid) => {
  return async (dispatch) => {
    try {
      const response = await fetch(formatStr(API.u.user.id, userid), {
        method: 'GET',
      });
      const status = response.status;
      const data = await response.json();
      if (status < 200 || status >= 300) {
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Unable to fetch user data');
        }
      }
      data.creation_time *= 1000;

      const {err: profileErr, data: profile} = await dispatch(
        GetProfile(data.userid),
      );
      if (!profileErr) {
        Object.assign(data, profile);
      }

      return {
        err: false,
        profileErr,
        data,
      };
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

const GetUserInfoBulk = (userids) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        formatStr(API.u.user.ids, userids.join(',')),
        {
          method: 'GET',
        },
      );
      const status = response.status;
      const data = await response.json();
      if (status < 200 || status >= 300) {
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Unable to fetch user info');
        }
      }

      return {
        err: false,
        data,
      };
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

const GetUserAccountByName = (username) => {
  return async (dispatch) => {
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      return {
        err: 'Need to reauthenticate',
      };
    }
    try {
      const response = await fetch(
        formatStr(API.u.user.nameprivate, username),
        {
          method: 'GET',
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
          throw new Error('Unable to fetch user data');
        }
      }
      data.creation_time *= 1000;

      return {
        err: false,
        data,
      };
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

const GetUserByIDPrivate = (userid) => {
  return async (dispatch) => {
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      return {
        err: 'Need to reauthenticate',
      };
    }
    try {
      const response = await fetch(formatStr(API.u.user.idprivate, userid), {
        method: 'GET',
        //TODO: change to same-origin
        credentials: 'include',
      });
      const status = response.status;
      const data = await response.json();
      if (status < 200 || status >= 300) {
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Unable to fetch user data');
        }
      }
      data.creation_time *= 1000;
      return {
        err: false,
        data,
      };
    } catch (e) {
      return {
        err: e.message,
      };
    }
  };
};

export {
  GetUserByName,
  GetUserByID,
  GetUserInfoBulk,
  GetUserAccountByName,
  GetUserByIDPrivate,
};
