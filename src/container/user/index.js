import {h, Component} from 'preact';
import {Switch, Route, Redirect} from 'react-router-dom';

import Loader from 'loader';

class UserContainer extends Component {
  render({match}) {
    return (
      <Switch>
        <Route
          path={`${match.url}/:username?`}
          component={Loader(() => {
            return import('container/user/user');
          })}
        />
        <Redirect to={`${match.url}/`} />
      </Switch>
    );
  }
}

export default UserContainer;
