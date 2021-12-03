import {lazy, useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import {GovUICtx} from '../../middleware';

const AuthContainer = lazy(() => import('./auth'));

const OAuth = () => {
  const ctx = useContext(GovUICtx);
  return (
    <Routes>
      <Route path="auth" element={<AuthContainer />} />
      <Route path="*" element={<Navigate to={ctx.pathHome} replace />} />
    </Routes>
  );
};

export default OAuth;
