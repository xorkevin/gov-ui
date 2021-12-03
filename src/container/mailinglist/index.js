import {lazy, Suspense, useContext} from 'react';
import {Routes, Route, Navigate, useHref} from 'react-router-dom';
import {MainContent, Section} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';

const Manage = lazy(() => import('./manage'));
const List = lazy(() => import('./list'));

const MailingLists = () => {
  const ctx = useContext(GovUICtx);
  const matchURL = useHref('');

  return (
    <MainContent>
      <Section>
        <Suspense fallback={ctx.fallbackView}>
          <Routes>
            <Route
              path="manage/*"
              element={<Manage listurl={`${matchURL}/l/{0}`} />}
            />
            <Route path="l/:listid/*" element={<List />} />
            <Route path="*" element={<Navigate to="manage" replace />} />
          </Routes>
        </Suspense>
      </Section>
    </MainContent>
  );
};

export default MailingLists;
