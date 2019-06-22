import React, {lazy, Suspense, useEffect, useCallback} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import {useAuthState} from 'service/auth';
import Section from 'component/section';

import {URL} from 'config';

const SigninContainer = lazy(() => import('container/login/signin'));
const CreateContainer = lazy(() => import('container/login/create'));
const CreateConfirmContainer = lazy(() => import('container/login/confirm'));
const ForgotPassContainer = lazy(() =>
  import('container/login/forgotpassword'),
);
const ResetPassContainer = lazy(() => import('container/login/resetpassword'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

const LoginContainer = ({history, match}) => {
  const navigateHome = useCallback(() => {
    history.replace(URL.home);
  }, [history]);

  const {loggedIn} = useAuthState();

  useEffect(() => {
    if (loggedIn) {
      navigateHome();
    }
  }, [loggedIn]);

  return (
    <Suspense fallback={FallbackView}>
      <Switch>
        <Route path={`${match.path}/login`} component={SigninContainer} />
        <Route path={`${match.path}/create`} component={CreateContainer} />
        <Route
          path={`${match.path}/confirm/:key?`}
          component={CreateConfirmContainer}
        />
        <Route path={`${match.path}/forgot`} component={ForgotPassContainer} />
        <Route
          path={`${match.path}/forgotconfirm/:key?`}
          component={ResetPassContainer}
        />
        <Redirect to={`${match.path}/login`} />
      </Switch>
    </Suspense>
  );
};

export default LoginContainer;
