import {h, Component} from 'preact';
import {withRouter} from 'react-router-dom';
import linkState from 'linkstate';
import Section from 'component/section';
import Menu from 'component/menu';
import FaIcon from 'component/faicon';
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
    this.navigateCreate = this.navigateCreate.bind(this);
  }

  navigateCreate(){
    this.props.history.push('/a/create');
  }

  login(){
    const {username, password} = this.state;
    this.props.login(username, password);
  }

  render({loading, err}){
    return <Section container padded>
      <Card center size="md" restrictWidth titleBar title={[
        <h3>Sign in</h3>
      ]} bar={[
        <Menu icon={<Button text><FaIcon icon="ellipsis-v"/></Button>} size="md" align="left" position="bottom">
          <span onClick={this.navigateCreate}>Create Account</span>
        </Menu>, <Button text>Cancel</Button>, <Button primary onClick={this.login}>Login</Button>
      ]}>
        <Input label="username" fullWidth onChange={linkState(this, 'username')}/>
        <Input label="password" type="password" error={!loading && err} fullWidth onChange={linkState(this, 'password')} onEnter={this.login}/>
      </Card>
    </Section>;
  }
}

const mapStateToProps = (state)=>{
  const {loading, err} = state.Auth;
  return {
    loading, err,
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
