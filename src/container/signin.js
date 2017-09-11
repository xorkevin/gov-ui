import {h, Component} from 'preact';
import {withRouter} from 'react-router-dom';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'preact-redux';
import {Login} from 'reducer/auth';

class SigninContainer extends Component {
  render(){
    return <Section container padded>
      <Card center size="md" restrictWidth titleBar title={[
        <h3>Sign in</h3>
      ]} bar={[
        <Button text>Cancel</Button>, <Button primary>Login</Button>
      ]}>
        <Input label="username" fullWidth/>
        <Input label="password" type="password" fullWidth/>
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
