import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Button from 'component/button';
import FaIcon from 'component/faicon';
import {connect} from 'react-redux';

const mapStateToProps = (state) => {
  const {valid, loading, loggedIn, authTags} = state.Auth;
  return {
    valid,
    loading,
    loggedIn,
    authTags,
  };
};

const Protected = (child, auth, args) => {
  return connect(mapStateToProps)(
    class extends Component {
      componentDidMount() {
        if (this.props.valid && !this.props.loading && !this.props.loggedIn) {
          if (this.props.history && this.props.history.replace) {
            this.props.history.replace('/x/login');
          }
        }
      }

      componentWillReceiveProps(nextProps) {
        if (nextProps.valid && !nextProps.loading && !nextProps.loggedIn) {
          if (this.props.history && this.props.history.replace) {
            this.props.history.replace('/x/login');
          }
        }
      }

      render() {
        const {authTags} = this.props;
        if (auth && !new Set(authTags.split(',')).has(auth)) {
          return (
            <div>
              <h4>Unauthorized</h4>
            </div>
          );
        }
        return React.createElement(child, Object.assign({}, this.props, args));
      }
    },
  );
};

export default Protected;
