import {lazy, useContext} from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import {GovUICtx} from '../../middleware';

const UserDetailsContainer = lazy(() => import('./user'));

const User = () => {
  const ctx = useContext(GovUICtx);
  return (
    <Routes>
      <Route path=":username" element={<UserDetailsContainer />} />
      <Route path="*" element={<Navigate to={ctx.pathHome} replace />} />
    </Routes>
  );
};

export default User;
