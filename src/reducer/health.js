import {API} from 'config';

const TIME_GET = Symbol('TIME_GET');
const TIME_UPDATE = Symbol('TIME_UPDATE');
const TIME_UPDATE_ERR = Symbol('TIME_UPDATE_ERR');

const TimeUpdate = (time)=>{
  return {
    type: TIME_UPDATE,
    time,
  };
};

const TimeUpdateErr = (err)=>{
  return {
    type: TIME_UPDATE_ERR,
    err,
  };
};

const TimeGet = ()=>{
  return async (dispatch)=>{
    dispatch({
      type: TIME_GET,
    });
    try {
      const response = await fetch(API.healthz.check, {
        method: 'GET',
        mode: 'cors',
      });
      const status = response.status;
      if(status >= 200 && status < 300){
        const data = await response.json();
        dispatch(TimeUpdate(data.time));
      } else {
        throw new Error('Could not get time from api server');
      }
    } catch(e) {
      dispatch(TimeUpdateErr(e.message));
    }
  };
};


const defaultState = {
  loading: false,
  success: false,
  time: '',
  err: '',
};

const initState = ()=>{
  return Object.assign({}, defaultState);
};

const Health = (state=initState(), action)=>{
  switch(action.type){
    case TIME_GET:
      return Object.assign({}, state, {
        loading: true,
        success: false,
        time: '',
        err: '',
      });
    case TIME_UPDATE:
      return Object.assign({}, state, {
        loading: false,
        success: true,
        time: action.time,
        err: '',
      });
    case TIME_UPDATE_ERR:
      return Object.assign({}, state, {
        loading: false,
        success: false,
        time: '',
        err: action.err,
      });
    default:
      return state;
  }
};

export {
  Health, TimeGet,
}
