import React from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

import SigninContainer from 'container/login/signin';
import CreateContainer from 'container/login/create';
import CreateConfirmContainer from 'container/login/confirm';
import ForgotPassContainer from 'container/login/forgotpassword';
import ResetPassContainer from 'container/login/resetpassword';

const Login = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/login`}>
        <SigninContainer />
      </Route>
      <Route path={`${match.path}/create`}>
        <CreateContainer />
      </Route>
      <Route path={`${match.path}/confirm`}>
        <CreateConfirmContainer />
      </Route>
      <Route path={`${match.path}/forgot`}>
        <ForgotPassContainer />
      </Route>
      <Route path={`${match.path}/forgotconfirm`}>
        <ResetPassContainer />
      </Route>
      <Redirect to={`${match.path}/login`} />
    </Switch>
  );
};

export {Login as default, Login};
