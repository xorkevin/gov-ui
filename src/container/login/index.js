import {lazy} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';

const SigninContainer = lazy(() => import('./signin'));
const CreateContainer = lazy(() => import('./create'));
const CreateConfirmContainer = lazy(() => import('./confirm'));
const ForgotPassContainer = lazy(() => import('./forgotpassword'));
const ResetPassContainer = lazy(() => import('./resetpassword'));

const Login = ({userApprovals}) => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/login`}>
        <SigninContainer />
      </Route>
      <Route path={`${match.path}/create`}>
        <CreateContainer
          pathLogin={`${match.path}/login`}
          pathConfirm={`${match.path}/confirm`}
          userApprovals={userApprovals}
        />
      </Route>
      <Route path={`${match.path}/confirm`}>
        <CreateConfirmContainer pathLogin={`${match.path}/login`} />
      </Route>
      <Route path={`${match.path}/forgot`}>
        <ForgotPassContainer
          pathLogin={`${match.path}/login`}
          pathResetPass={`${match.path}/resetpass`}
        />
      </Route>
      <Route path={`${match.path}/resetpass`}>
        <ResetPassContainer pathLogin={`${match.path}/login`} />
      </Route>
      <Redirect to={`${match.path}/login`} />
    </Switch>
  );
};

export default Login;
