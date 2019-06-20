const GETUSER = Symbol('GETUSER');
const GETUSER_SUCCESS = Symbol('GETUSER_SUCCESS');
const GETUSER_ERR = Symbol('GETUSER_ERR');

const GetUserSuccess = (data) => {
  return {
    type: GETUSER_SUCCESS,
    data,
  };
};

const GetUserErr = (err) => {
  return {
    type: GETUSER_ERR,
    err,
  };
};

const GetLoggedInUser = () => {
  return async (dispatch) => {
    dispatch({
      type: GETUSER,
    });
    const {relogin} = await dispatch(ReLogin());
    if (relogin) {
      dispatch(GetUserErr('Need to reauthenticate'));
      return;
    }
    try {
      const response = await fetch(API.u.user.get, {
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
      dispatch(GetUserSuccess(data));
    } catch (e) {
      dispatch(GetUserErr(e));
    }
  };
};

const defaultState = Object.freeze({
  loading: false,
  username: '',
  firstname: '',
  lastname: '',
  email: '',
  creationTime: Date.now(),
  err: false,
});

const initState = () => {
  return Object.assign({}, defaultState);
};

const UserAccount = (state = initState(), action) => {
  switch (action.type) {
    case GETUSER:
      return Object.assign({}, state, {
        loading: true,
      });
    case GETUSER_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        userid: action.data.userid,
        authTags: action.data.auth_tags,
        username: action.data.username,
        firstname: action.data.first_name,
        lastname: action.data.last_name,
        email: action.data.email,
        creationTime: action.data.creation_time,
        err: false,
      });
    case GETUSER_ERR:
      return Object.assign({}, state, {
        loading: false,
        err: action.err,
      });
    default:
      return state;
  }
};

export {GetLoggedInUser};
