import {h, Component} from 'preact';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';

import Loader from 'loader';

import {connect} from 'preact-redux';
import {GetUserByName} from 'reducer/user';

class UserContainer extends Component {
  render({match}){
    return <Switch>
      <Route path={`${match.url}/:username?`} component={Loader(()=>{return import('container/user/user');})}/>
      <Redirect to={`${match.url}/`}/>
    </Switch>;
  }
}

UserContainer = withRouter(UserContainer);

export default UserContainer
