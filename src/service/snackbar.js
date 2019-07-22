import React, {useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import SnackbarComponent from 'component/snackbar';

// Actions

const SNACKBAR_FRAGMENT = Symbol('SNACKBAR_FRAGMENT');
const SnackbarFragment = (fragment) => ({
  type: SNACKBAR_FRAGMENT,
  fragment,
});

const SNACKBAR_HIDE = Symbol('SNACKBAR_HIDE');
const SnackbarHide = () => ({
  type: SNACKBAR_HIDE,
});

// Reducer

const defaultState = Object.freeze({
  show: false,
  fragment: null,
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
      });
    case SNACKBAR_HIDE:
      return Object.assign({}, state, {
        show: false,
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

  const display = useCallback(
    (fragment) => {
      dispatch(SnackbarFragment(fragment));
    },
    [dispatch],
  );

  return display;
};

// Higher Order

const SnackbarContainer = () => {
  const {show, fragment} = useSnackbarState();
  return <SnackbarComponent show={show}>{fragment}</SnackbarComponent>;
};

export {Snackbar as default, useSnackbarState, useSnackbar, SnackbarContainer};
