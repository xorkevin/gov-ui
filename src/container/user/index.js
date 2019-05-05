import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import Loader from 'loader';

const loadUserDetailsContainer = Loader(() => {
  return import('container/user/user');
});

class UserContainer extends Component {
  render() {
    const {match} = this.props;
    return (
      <Switch>
        <Route
          path={`${match.url}/:username?`}
          component={loadUserDetailsContainer}
        />
        <Redirect to={`${match.url}/`} />
      </Switch>
    );
  }
}

export default UserContainer;
