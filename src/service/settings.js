import React, {useCallback} from 'react';
import {useSelector, useDispatch, useStore} from 'react-redux';
import {getCookie, setCookie} from 'utility';

// Actions

const TOGGLE_DARK_MODE = Symbol('TOGGLE_DARK_MODE');

const darkModeCookieName = 'dark_mode';
const darkModeCookieEnabled = 'enabled';
const darkModeCookieDisabled = 'disabled';
const darkModeClassName = 'dark';

const setDarkMode = (dark) => {
  if (dark) {
    setCookie(darkModeCookieName, darkModeCookieEnabled);
    document.body.classList.add(darkModeClassName);
  } else {
    setCookie(darkModeCookieName, darkModeCookieDisabled);
    document.body.classList.remove(darkModeClassName);
  }
};

const checkDarkMode = () => {
  return getCookie(darkModeCookieName) === darkModeCookieEnabled;
};

// Reducer

const defaultState = {
  dark: false,
};

const initState = () => {
  const k = {};
  if (checkDarkMode()) {
    k.dark = true;
  }
  const state = Object.assign({}, defaultState, k);
  setDarkMode(state.dark);
  return state;
};

const Settings = (state = initState(), action) => {
  switch (action.type) {
    case TOGGLE_DARK_MODE:
      return Object.assign({}, state, {
        dark: action.dark,
      });
    default:
      return state;
  }
};

// Hooks

const selectDarkState = (store) => store.Settings.dark;

const useDarkMode = () => {
  const dispatch = useDispatch();
  const store = useStore();

  const toggle = useCallback(() => {
    const dark = !store.getState().Settings.dark;
    setDarkMode(dark);
    dispatch({
      type: TOGGLE_DARK_MODE,
      dark,
    });
  }, [dispatch, store]);

  return [useSelector(selectDarkState), toggle];
};

export {Settings as default, Settings, useDarkMode};
