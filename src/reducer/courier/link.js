import {API} from 'config';
import {formatStr} from 'utility';
import {ReLogin} from 'reducer/auth';

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

const CreateLink = (linkid, url) => {
  return async (dispatch) => {
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      return {
        err: 'Need to reauthenticate',
      };
    }
    try {
      const response = await fetch(API.courier.link.new, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
        body: JSON.stringify({linkid, url}),
      });
      const status = response.status;
      const data = await response.json();
      if (status < 200 || status >= 300) {
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Unable to create link');
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

const DeleteLink = (linkid) => {
  return async (dispatch) => {
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      return {
        err: 'Need to reauthenticate',
      };
    }
    try {
      const response = await fetch(formatStr(API.courier.link.id, linkid), {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
      });
      const status = response.status;
      if (status < 200 || status >= 300) {
        const data = await response.json();
        if (data && data.message) {
          throw new Error(data.message);
        } else {
          throw new Error('Unable to delete link');
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

export {GetLinkGroup, CreateLink, DeleteLink};
