import React, {lazy, Suspense} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import Section from 'component/section';

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

const LoginContainer = () => {
  const match = useRouteMatch();

  return (
    <Suspense fallback={FallbackView}>
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
    </Suspense>
  );
};

export default LoginContainer;
