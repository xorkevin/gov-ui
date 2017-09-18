import {API} from 'config';
import {ReLogin} from 'reducer/account/auth';

const CREATEPROFILE = Symbol('CREATEPROFILE');
const CREATEPROFILE_SUCCESS = Symbol('CREATEPROFILE_SUCCESS');
const CREATEPROFILE_ERR = Symbol('CREATEPROFILE_ERR');

const CreateProfileSuccess = ()=>{
  return {
    type: CREATEPROFILE_SUCCESS,
  };
};

const CreateProfileErr = (err)=>{
  return {
    type: CREATEPROFILE_ERR,
    err,
  };
};

const CreateProfileReq = (options)=>{
  return async (dispatch)=>{
    dispatch({
      type: CREATEPROFILE,
    });
    const {relogin} = await dispatch(ReLogin());
    if(relogin){
      dispatch(CreateProfileErr('Need to reauthenticate'));
      return;
    }
    try {
      const response = await fetch(API.profile.new, {
        method: 'POST',
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
          throw new Error('Could not create account');
        }
      }
      dispatch(CreateProfileSuccess());
    } catch(e){
      dispatch(CreateProfileErr(e.message));
    }
  };
};

const GETPROFILE = Symbol('GETPROFILE');
const GETPROFILE_SUCCESS = Symbol('GETPROFILE_SUCCESS');
const GETPROFILE_ERR = Symbol('GETPROFILE_ERR');

const GetProfileSuccess = (profile)=>{
  return {
    type: GETPROFILE_SUCCESS,
    profile,
  };
};

const GetProfileErr = (err, canCreate=false)=>{
  return {
    type: GETPROFILE_ERR,
    canCreate,
    err,
  };
};

const GetProfileReq = ()=>{
  return async (dispatch)=>{
    dispatch({
      type: GETPROFILE,
    });
    const {relogin} = await dispatch(ReLogin());
    if(relogin){
      dispatch(GetProfileErr('Need to reauthenticate'));
      return;
    }
    try {
      const response = await fetch(API.profile.get, {
        method: 'GET',
        //TODO: change to same-origin
        credentials: 'include',
      });
      const status = response.status;
      const data = await response.json();
      if(status >= 200 && status < 300){
        dispatch(GetProfileSuccess(data));
      } else if(data && data.code === 2){
        dispatch(GetProfileErr(data.message, true));
      } else if(data && data.message){
        throw new Error(data.message);
      } else {
        throw new Error('Could not get account');
      }
    } catch(e){
      dispatch(GetProfileErr(e.message));
    }
  };
};

const defaultState = {
  createloading: false,
  createsuccess: false,
  createerr: false,
  loading: false,
  success: false,
  profile: false,
  err: false,
  canCreate: false,
};

const initState = ()=>{
  return Object.assign({}, defaultState);
};

const Profile = (state=initState(), action)=>{
  switch(action.type){
    case CREATEPROFILE:
      return Object.assign({}, state, {
        createloading: true,
      });
    case CREATEPROFILE_SUCCESS:
      return Object.assign({}, state, {
        createloading: false,
        createsuccess: true,
        createerr: false,
      });
    case CREATEPROFILE_ERR:
      return Object.assign({}, state, {
        createloading: false,
        createsuccess: false,
        createerr: action.err,
      });
    case GETPROFILE:
      return Object.assign({}, state, {
        loading: true,
      });
    case GETPROFILE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        success: true,
        profile: action.profile,
        err: false,
        canCreate: false,
      });
    case GETPROFILE_ERR:
      return Object.assign({}, state, {
        loading: false,
        success: false,
        err: action.err,
        canCreate: action.canCreate,
      });
    default:
      return state;
  }
};

export {
  Profile, CreateProfileReq, GetProfileReq,
}
