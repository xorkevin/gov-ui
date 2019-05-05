import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import linkState from 'linkstate';
import Section from 'component/section';
import Menu from 'component/menu';
import FaIcon from 'component/faicon';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'react-redux';
import {Login} from 'reducer/account/auth';

class SigninContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
    this.login = this.login.bind(this);
  }

  login() {
    const {username, password} = this.state;
    this.props.login(username, password);
  }

  render() {
    const {loading, err} = this.props;
    return (
      <Section container padded>
        <Card
          center
          size="md"
          restrictWidth
          titleBar
          title={[<h3>Sign in</h3>]}
          bar={[
            <Menu
              icon={
                <Button text>
                  <FaIcon icon="ellipsis-v" />
                </Button>
              }
              size="md"
              align="left"
              position="bottom"
            >
              <Link to="/x/create">
                <FaIcon icon="user-plus" /> Create Account
              </Link>
              <Link to="/x/forgot">
                <FaIcon icon="unlock-alt" /> Forgot Password
              </Link>
            </Menu>,
            <Button primary onClick={this.login}>
              Login
            </Button>,
          ]}
        >
          <Input
            label="username / email"
            fullWidth
            onChange={linkState(this, 'username')}
          />
          <Input
            label="password"
            type="password"
            fullWidth
            onChange={linkState(this, 'password')}
            onEnter={this.login}
          />
          {!loading && err && <span>{err}</span>}
        </Card>
      </Section>
    );
  }
}

const mapStateToProps = (state) => {
  const {loading, err} = state.Auth;
  return {
    loading,
    err,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => {
      dispatch(Login(username, password));
    },
  };
};

SigninContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SigninContainer);

export default SigninContainer;
