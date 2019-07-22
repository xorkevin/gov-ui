import React, {useCallback} from 'react';
import {useSelector, useDispatch, useStore} from 'react-redux';
import SnackbarComponent from 'component/snackbar';

// Constants

const TIME_DISPLAY = 4000;
const TIME_ANIMATE = 500;

// Actions

const SNACKBAR_FRAGMENT = Symbol('SNACKBAR_FRAGMENT');
const SnackbarFragment = (fragment, timer) => ({
  type: SNACKBAR_FRAGMENT,
  fragment,
  timer,
});

const SNACKBAR_HIDE = Symbol('SNACKBAR_HIDE');
const SnackbarHide = (timer) => ({
  type: SNACKBAR_HIDE,
  timer,
});

// Reducer

const defaultState = Object.freeze({
  show: false,
  fragment: null,
  timer: null,
});

const initState = () => {
  return Object.assign({}, defaultState);
};

const Snackbar = (state = initState(), action) => {
  switch (action.type) {
    case SNACKBAR_FRAGMENT:
      return Object.assign({}, state, {
        show: true,
        fragment: action.fragment,
        timer: action.timer,
      });
    case SNACKBAR_HIDE:
      return Object.assign({}, state, {
        show: false,
        timer: action.timer,
      });
    default:
      return state;
  }
};

// Hooks

const selectReducerSnackbar = (store) => store.Snackbar;

const useSnackbarState = () => useSelector(selectReducerSnackbar);

const useSnackbar = () => {
  const dispatch = useDispatch();
  const store = useStore();

  const display = useCallback(
    async (fragment, delay = TIME_DISPLAY) => {
      const {show, timer} = store.getState().Snackbar;
      if (timer) {
        window.clearTimeout(timer);
      }

      const display = () => {
        const nextTimer = window.setTimeout(() => {
          dispatch(SnackbarHide(null));
        }, delay);
        dispatch(SnackbarFragment(fragment, nextTimer));
      };

      if (show) {
        const nextTimer = window.setTimeout(display, TIME_ANIMATE);
        dispatch(SnackbarHide(nextTimer));
      } else {
        display();
      }
    },
    [dispatch, store],
  );

  return display;
};

// Higher Order

const SnackbarContainer = () => {
  const {show, fragment} = useSnackbarState();
  return <SnackbarComponent show={show}>{fragment}</SnackbarComponent>;
};

export {Snackbar as default, useSnackbarState, useSnackbar, SnackbarContainer};
