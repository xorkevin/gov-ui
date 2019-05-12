import React, {Component, lazy, Suspense} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {connect} from 'react-redux';

const SigninContainer = lazy(() => import('container/login/signin'));
const CreateContainer = lazy(() => import('container/login/create'));
const CreateConfirmContainer = lazy(() => import('container/login/confirm'));
const ForgotPassContainer = lazy(() =>
  import('container/login/forgotpassword'),
);
const ResetPassContainer = lazy(() => import('container/login/resetpassword'));

const FallbackView = (
  <Section container padded narrow>
    Loading
  </Section>
);

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
      <Suspense fallback={FallbackView}>
        <Switch>
          <Route path={`${match.path}/login`} component={SigninContainer} />
          <Route path={`${match.path}/create`} component={CreateContainer} />
          <Route
            path={`${match.path}/confirm/:key?`}
            component={CreateConfirmContainer}
          />
          <Route
            path={`${match.path}/forgot`}
            component={ForgotPassContainer}
          />
          <Route
            path={`${match.path}/forgotconfirm/:key?`}
            component={ResetPassContainer}
          />
          <Redirect to={`${match.path}/login`} />
        </Switch>
      </Suspense>
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
