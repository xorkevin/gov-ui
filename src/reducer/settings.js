import {API} from 'config';
import {getCookie, setCookie} from 'utility';

const DARK_MODE = Symbol('DARK_MODE');

const root = document.getElementsByTagName('html')[0];

const DarkMode = () => {
  return async (dispatch, getState) => {
    const dark = getState().Settings.dark;
    if (dark) {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      setCookie('dark_mode', 'off');
    } else {
      root.classList.add('dark');
      document.body.classList.add('dark');
      setCookie('dark_mode', 'on');
    }
    dispatch({
      type: DARK_MODE,
      dark: !dark,
    });
  };
};

const defaultState = {
  dark: false,
};

const initState = () => {
  const k = {};
  if (getCookie('dark_mode') === 'on') {
    k.dark = true;
    root.classList.add('dark');
    document.body.classList.add('dark');
  }
  return Object.assign({}, defaultState, k);
};

const Settings = (state = initState(), action) => {
  switch (action.type) {
    case DARK_MODE:
      return Object.assign({}, state, {
        dark: action.dark,
      });
    default:
      return state;
  }
};

export {Settings as default, Settings, DarkMode};
