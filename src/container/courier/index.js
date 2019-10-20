import React, {Fragment, lazy, Suspense} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  useRouteMatch,
} from 'react-router-dom';
import {Section, Tabbar, FaIcon} from '@xorkevin/nuke';

const CourierLink = lazy(() => import('container/courier/link'));
const CourierBrand = lazy(() => import('container/courier/brand'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

const CourierContainer = () => {
  const match = useRouteMatch();

  return (
    <Section container narrow padded sectionTitle="Courier">
      <Tabbar
        left={
          <Fragment>
            <NavLink to={`${match.url}/link`}>
              <FaIcon icon="link" /> Link
            </NavLink>
            <NavLink to={`${match.url}/brand`}>
              <FaIcon icon="shield" /> Brand
            </NavLink>
          </Fragment>
        }
      />
      <Suspense fallback={FallbackView}>
        <Switch>
          <Route path={`${match.path}/link`}>
            <CourierLink />
          </Route>
          <Route path={`${match.path}/brand`}>
            <CourierBrand />
          </Route>
          <Redirect to={`${match.path}/link`} />
        </Switch>
      </Suspense>
    </Section>
  );
};

export default CourierContainer;
