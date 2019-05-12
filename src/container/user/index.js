import React, {Component, lazy, Suspense} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Section from 'component/section';

const UserDetailsContainer = lazy(() => import('container/user/user'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

class UserContainer extends Component {
  render() {
    const {match} = this.props;
    return (
      <Suspense fallback={FallbackView}>
        <Switch>
          <Route
            path={`${match.url}/:username?`}
            component={UserDetailsContainer}
          />
          <Redirect to={`${match.url}/`} />
        </Switch>
      </Suspense>
    );
  }
}

export default UserContainer;
