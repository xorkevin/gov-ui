import {API} from 'config';
import {ReLogin} from 'reducer/account/auth';

const EDITACCOUNT = Symbol('EDITACCOUNT');
const EDITACCOUNT_SUCCESS = Symbol('EDITACCOUNT_SUCCESS');
const EDITACCOUNT_ERR = Symbol('EDITACCOUNT_ERR');

const EditAccountSuccess = ()=>{
  return {
    type: EDITACCOUNT_SUCCESS,
  };
};

const EditAccountErr = (err)=>{
  return {
    type: EDITACCOUNT_ERR,
    err,
  };
};

const EditAccountReq = (options)=>{
  return async (dispatch)=>{
    dispatch({
      type: EDITACCOUNT,
    });
    const {relogin} = await dispatch(ReLogin());
    if(relogin){
      dispatch(EditAccountErr('Need to reauthenticate'));
      return;
    }
    try {
      const response = await fetch(API.u.user.edit, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        //TODO: change to same-origin
        credentials: 'include',
        body: JSON.stringify(options),
      });
      const status = response.status;
      if(status < 200 || status >= 300){
        const data = await response.json();
        if(data && data.message){
          throw new Error(data.message);
        } else {
          throw new Error('Could not edit account');
        }
      }
      dispatch(EditAccountSuccess());
    } catch(e){
      dispatch(EditAccountErr(e.message));
    }
  };
};

const defaultState = {
  loading: false,
  success: false,
  err: false,
};

const initState = ()=>{
  return Object.assign({}, defaultState);
};

const EditAccount = (state=initState(), action)=>{
  switch(action.type){
    case EDITACCOUNT:
      return Object.assign({}, state, {
        loading: true,
      });
    case EDITACCOUNT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        success: true,
        err: false,
      });
    case EDITACCOUNT_ERR:
      return Object.assign({}, state, {
        loading: false,
        success: false,
        err: action.err,
      });
    default:
      return state;
  }
};

export {
  EditAccount, EditAccountReq,
}
