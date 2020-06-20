import React from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

import SigninContainer from './signin';
import CreateContainer from './create';
import CreateConfirmContainer from './confirm';
import ForgotPassContainer from './forgotpassword';
import ResetPassContainer from './resetpassword';

const Login = ({userApprovals}) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/login`}>
        <SigninContainer />
      </Route>
      <Route path={`${match.path}/create`}>
        <CreateContainer userApprovals={userApprovals} />
      </Route>
      <Route path={`${match.path}/confirm`}>
        <CreateConfirmContainer />
      </Route>
      <Route path={`${match.path}/forgot`}>
        <ForgotPassContainer />
      </Route>
      <Route path={`${match.path}/resetpass`}>
        <ResetPassContainer />
      </Route>
      <Redirect to={`${match.path}/login`} />
    </Switch>
  );
};

export {Login as default, Login};
