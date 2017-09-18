import {h, Component} from 'preact';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import Section from 'component/section';

import Loader from 'loader';

class Account extends Component {
  constructor(props){
    super(props);
    this.navigateHome = this.navigateHome.bind(this);
  }

  navigateHome(){
    this.props.history.replace('/');
  }

  render({match}){
    return <Section container narrow padded sectionTitle="Settings">
      <Switch>
        <Route path={`${match.path}/account`} component={Loader(()=>{return import('container/account/details');})}/>
        <Route path={`${match.path}/profile`} component={Loader(()=>{return import('container/account/profile');})}/>
        <Redirect to={`${match.path}/account`}/>
      </Switch>
    </Section>;
  }
}

Account = withRouter(Account);

export default Account
