import {lazy, useContext} from 'react';
import {Routes, Route, Navigate, useHref} from 'react-router-dom';

import {GovUICtx} from '../../middleware';

const OrgDetailsContainer = lazy(() => import('./org'));

const Org = () => {
  const ctx = useContext(GovUICtx);
  const matchURL = useHref('');
  return (
    <Routes>
      <Route
        path=":name/*"
        element={<OrgDetailsContainer pathOrg={`${matchURL}/{0}`} />}
      />
      <Route path="*" element={<Navigate to={ctx.pathHome} replace />} />
    </Routes>
  );
};

export default Org;
