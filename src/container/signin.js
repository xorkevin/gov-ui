import {h, Component} from 'preact';
import {withRouter} from 'react-router-dom';
import linkState from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'preact-redux';
import {Login} from 'reducer/auth';

class SigninContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.login = this.login.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
  }

  navigateHome(){
    this.props.history.replace('/');
  }

  login(){
    const {username, password} = this.state;
    this.props.login(username, password);
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

  render(){
    return <Section container padded>
      <Card center size="md" restrictWidth titleBar title={[
        <h3>Sign in</h3>
      ]} bar={[
        <Button text>Cancel</Button>, <Button primary onClick={this.login}>Login</Button>
      ]}>
        <Input label="username" fullWidth onChange={linkState(this, 'username')}/>
        <Input label="password" type="password" fullWidth onChange={linkState(this, 'password')} onEnter={this.login}/>
      </Card>
    </Section>;
  }
}

const mapStateToProps = (state)=>{
  const {loggedIn} = state.Auth;
  return {
    loggedIn,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    login: (username, password)=>{
      dispatch(Login(username, password));
    },
  };
};

SigninContainer = connect(mapStateToProps, mapDispatchToProps)(SigninContainer);
SigninContainer = withRouter(SigninContainer);

export default SigninContainer
