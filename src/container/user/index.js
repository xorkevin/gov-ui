import {h, Component} from 'preact';
import {Switch, Route, Redirect} from 'react-router-dom';

import Loader from 'loader';

const loadUserDetailsContainer = Loader(() => {
  return import('container/user/user');
});

class UserContainer extends Component {
  render({match}) {
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
