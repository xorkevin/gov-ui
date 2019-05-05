import React, {Component} from 'react';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';
import Section from 'component/section';
import Tabbar from 'component/tabbar';
import FaIcon from 'component/faicon';

import Loader from 'loader';

const loadCourierLink = Loader(() => {
  return import('container/courier/link');
});

class CourierContainer extends Component {
  render({match}) {
    return (
      <Section container narrow padded sectionTitle="Courier">
        <Tabbar
          left={[
            {
              key: 'link',
              component: (
                <NavLink to={`${match.path}/link`}>
                  <FaIcon icon="link" /> Link
                </NavLink>
              ),
            },
          ]}
        />
        <Switch>
          <Route path={`${match.url}/link`} component={loadCourierLink} />
          <Redirect to={`${match.url}/link`} />
        </Switch>
      </Section>
    );
  }
}

export default CourierContainer;
