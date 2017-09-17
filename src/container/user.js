import {h, Component} from 'preact';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';

import Loader from 'loader';

class UserContainer extends Component {
  constructor(props){
    super(props);
    this.navigateHome = this.navigateHome.bind(this);
  }

  navigateHome(){
    this.props.history.replace('/');
  }

  render({match}){
    return <Switch>
      <Route path={`${match.path}/account`} component={Loader(()=>{return import('container/useraccount');})}/>
      <Redirect to={`${match.path}/account`}/>
    </Switch>;
  }
}

UserContainer = withRouter(UserContainer);

export default UserContainer
