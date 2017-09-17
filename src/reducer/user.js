import {API} from 'config';
import {formatStr} from 'utility';
import {ReLogin} from 'reducer/account/auth';

const GetUserByName = (username)=>{
  return async (dispatch)=>{
    try {
      const response = await fetch(formatStr(API.u.user.name, username), {
        method: 'GET',
      });
      const status = response.status;
      const data = await response.json();
      if(status < 200 || status >= 300){
        if(data && data.message){
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
    } catch(e){
      return {
        err: e,
      };
    }
  };
};

const GetUserByID = (userid)=>{
  return async (dispatch)=>{
    try {
      const response = await fetch(formatStr(API.u.user.id, userid), {
        method: 'GET',
      });
      const status = response.status;
      const data = await response.json();
      if(status < 200 || status >= 300){
        if(data && data.message){
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
    } catch(e){
      return {
        err: e,
      };
    }
  };
};

const GetUserByIDPrivate = (userid)=>{
  return async (dispatch)=>{
    const {relogin} = await dispatch(ReLogin());
    if(relogin){
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
      if(status < 200 || status >= 300){
        if(data && data.message){
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
    } catch(e){
      return {
        err: e,
      };
    }
  };
};

export {
  GetUserByName, GetUserByID, GetUserByIDPrivate,
}
