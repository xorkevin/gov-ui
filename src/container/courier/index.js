import React, {Fragment} from 'react';
import {
  Switch,
  Route,
  Redirect,
  NavLink,
  useRouteMatch,
} from 'react-router-dom';
import {Section, Tabbar, FaIcon} from '@xorkevin/nuke';

import CourierLink from 'container/courier/link';
import CourierBrand from 'container/courier/brand';

const Courier = ({courierPath}) => {
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
      <Switch>
        <Route path={`${match.path}/link`}>
          <CourierLink courierPath={courierPath} />
        </Route>
        <Route path={`${match.path}/brand`}>
          <CourierBrand />
        </Route>
        <Redirect to={`${match.path}/link`} />
      </Switch>
    </Section>
  );
};

export {Courier as default, Courier};
