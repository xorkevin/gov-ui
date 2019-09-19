import React, {Fragment, lazy, Suspense} from 'react';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';
import Section from 'component/section';
import Tabbar from 'component/tabbar';
import FaIcon from 'component/faicon';

const CourierLink = lazy(() => import('container/courier/link'));
const CourierBrand = lazy(() => import('container/courier/brand'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

const CourierContainer = ({match}) => {
  return (
    <Section container narrow padded sectionTitle="Courier">
      <Tabbar
        left={
          <Fragment>
            <NavLink to={`${match.path}/link`}>
              <FaIcon icon="link" /> Link
            </NavLink>
            <NavLink to={`${match.path}/brand`}>
              <FaIcon icon="shield" /> Brand
            </NavLink>
          </Fragment>
        }
      />
      <Suspense fallback={FallbackView}>
        <Switch>
          <Route path={`${match.url}/link`} component={CourierLink} />
          <Route path={`${match.url}/brand`} component={CourierBrand} />
          <Redirect to={`${match.url}/link`} />
        </Switch>
      </Suspense>
    </Section>
  );
};

export default CourierContainer;
