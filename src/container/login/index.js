import {lazy} from 'react';
import {Routes, Route, Navigate, useHref} from 'react-router-dom';

const SigninContainer = lazy(() => import('./signin'));
const CreateContainer = lazy(() => import('./create'));
const CreateConfirmContainer = lazy(() => import('./confirm'));
const ForgotPassContainer = lazy(() => import('./forgotpassword'));
const ResetPassContainer = lazy(() => import('./resetpassword'));

const Login = () => {
  const matchURL = useHref('');
  const pathLogin = `${matchURL}/login`;
  const pathCreate = `${matchURL}/create`;
  const pathConfirm = `${matchURL}/confirm`;
  const pathForgot = `${matchURL}/forgot`;
  const pathResetPass = `${matchURL}/resetpass`;
  return (
    <Routes>
      <Route
        path="login"
        element={
          <SigninContainer pathCreate={pathCreate} pathForgot={pathForgot} />
        }
      />
      <Route
        path="create"
        element={
          <CreateContainer pathLogin={pathLogin} pathConfirm={pathConfirm} />
        }
      />
      <Route
        path="confirm"
        element={<CreateConfirmContainer pathLogin={pathLogin} />}
      />
      <Route
        path="forgot"
        element={
          <ForgotPassContainer
            pathLogin={pathLogin}
            pathResetPass={pathResetPass}
          />
        }
      />
      <Route
        path="resetpass"
        element={<ResetPassContainer pathLogin={pathLogin} />}
      />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
};

export default Login;
