import {lazy, Suspense, useContext} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {MainContent, Section} from '@xorkevin/nuke';

import {GovUICtx} from '../../middleware';

const Manage = lazy(() => import('./manage'));
const List = lazy(() => import('./list'));

const MailingLists = () => {
  const ctx = useContext(GovUICtx);
  const match = useRouteMatch();

  return (
    <MainContent>
      <Section>
        <Suspense fallback={ctx.fallbackView}>
          <Switch>
            <Route path={`${match.path}/manage`}>
              <Manage listurl={`${match.url}/l/{0}`} />
            </Route>
            <Route path={`${match.path}/l/:listid`}>
              <List />
            </Route>
            <Redirect to={`${match.url}/manage`} />
          </Switch>
        </Suspense>
      </Section>
    </MainContent>
  );
};

export default MailingLists;
