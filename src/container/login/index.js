import {lazy} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

const SigninContainer = lazy(() => import('./signin'));
const CreateContainer = lazy(() => import('./create'));
const CreateConfirmContainer = lazy(() => import('./confirm'));
const ForgotPassContainer = lazy(() => import('./forgotpassword'));
const ResetPassContainer = lazy(() => import('./resetpassword'));

const Login = () => {
  const match = useRouteMatch();
  const pathLogin = `${match.url}/login`;
  const pathConfirm = `${match.url}/confirm`;
  const pathResetPass = `${match.url}/resetpass`;
  return (
    <Switch>
      <Route path={`${match.path}/login`}>
        <SigninContainer />
      </Route>
      <Route path={`${match.path}/create`}>
        <CreateContainer pathLogin={pathLogin} pathConfirm={pathConfirm} />
      </Route>
      <Route path={`${match.path}/confirm`}>
        <CreateConfirmContainer pathLogin={pathLogin} />
      </Route>
      <Route path={`${match.path}/forgot`}>
        <ForgotPassContainer
          pathLogin={pathLogin}
          pathResetPass={pathResetPass}
        />
      </Route>
      <Route path={`${match.path}/resetpass`}>
        <ResetPassContainer pathLogin={pathLogin} />
      </Route>
      <Redirect to={pathLogin} />
    </Switch>
  );
};

export default Login;
