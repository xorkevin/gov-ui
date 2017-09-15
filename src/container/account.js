import {h, Component} from 'preact';
import {Switch, Route, withRouter} from 'react-router-dom';

import {connect} from 'preact-redux';
import Loader from 'loader';

class AccountContainer extends Component {
  constructor(props){
    super(props);
    this.navigateHome = this.navigateHome.bind(this);
  }

  navigateHome(){
    this.props.history.replace('/');
  }

  componentWillMount(){
    if(this.props.loggedIn){
      this.navigateHome();
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.loggedIn){
      this.navigateHome();
    }
  }

  render({match}){
    return <Switch>
      <Route path={`${match.path}/login`} component={Loader(()=>{return import('container/signin');})}/>
      <Route path={`${match.path}/create`} component={Loader(()=>{return import('container/createaccount');})}/>
      <Route path={`${match.path}/confirm/:key?`} component={Loader(()=>{return import('container/confirmaccount');})}/>
    </Switch>;
  }
}

const mapStateToProps = (state)=>{
  const {loggedIn} = state.Auth;
  return {
    loggedIn,
  };
};

AccountContainer = connect(mapStateToProps)(AccountContainer);
AccountContainer = withRouter(AccountContainer);

export default AccountContainer
