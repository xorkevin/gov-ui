import React, {Component} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {connect} from 'react-redux';
import Loader from 'loader';

const loadSigninContainer = Loader(() => {
  return import('container/login/signin');
});
const loadCreateContainer = Loader(() => {
  return import('container/login/create');
});
const loadCreateConfirmContainer = Loader(() => {
  return import('container/login/confirm');
});
const loadForgotPassContainer = Loader(() => {
  return import('container/login/forgotpassword');
});
const loadResetPassContainer = Loader(() => {
  return import('container/login/resetpassword');
});

class LoginContainer extends Component {
  constructor(props) {
    super(props);
    this.navigateHome = this.navigateHome.bind(this);
  }

  navigateHome() {
    this.props.history.replace('/');
  }

  componentDidMount() {
    if (this.props.loggedIn) {
      this.navigateHome();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn) {
      this.navigateHome();
    }
  }

  render() {
    const {match} = this.props;
    return (
      <Switch>
        <Route path={`${match.path}/login`} component={loadSigninContainer} />
        <Route path={`${match.path}/create`} component={loadCreateContainer} />
        <Route
          path={`${match.path}/confirm/:key?`}
          component={loadCreateConfirmContainer}
        />
        <Route
          path={`${match.path}/forgot`}
          component={loadForgotPassContainer}
        />
        <Route
          path={`${match.path}/forgotconfirm/:key?`}
          component={loadResetPassContainer}
        />
        <Redirect to={`${match.path}/login`} />
      </Switch>
    );
  }
}

const mapStateToProps = (state) => {
  const {loggedIn} = state.Auth;
  return {
    loggedIn,
  };
};

LoginContainer = connect(mapStateToProps)(LoginContainer);

export default LoginContainer;
