import {h, Component} from 'preact';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';

import {connect} from 'preact-redux';
import Loader from 'loader';

class LoginContainer extends Component {
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
      <Route path={`${match.path}/login`} component={Loader(()=>{return import('container/login/signin');})}/>
      <Route path={`${match.path}/create`} component={Loader(()=>{return import('container/login/create');})}/>
      <Route path={`${match.path}/confirm/:key?`} component={Loader(()=>{return import('container/login/confirm');})}/>
      <Route path={`${match.path}/forgot`} component={Loader(()=>{return import('container/login/forgotpassword');})}/>
      <Route path={`${match.path}/forgotconfirm/:key?`} component={Loader(()=>{return import('container/login/resetpassword');})}/>
      <Redirect to={`${match.path}/login`}/>
    </Switch>;
  }
}

const mapStateToProps = (state)=>{
  const {loggedIn} = state.Auth;
  return {
    loggedIn,
  };
};

LoginContainer = connect(mapStateToProps)(LoginContainer);
LoginContainer = withRouter(LoginContainer);

export default LoginContainer
