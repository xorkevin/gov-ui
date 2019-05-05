import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import linkState from 'linkstate';
import Section from 'component/section';
import FaIcon from 'component/faicon';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'react-redux';
import {ConfirmResetReq} from 'reducer/account/forgotpassword';

class ConfirmReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: props.match.params.key || '',
      newPassword: '',
      clienterr: false,
      passwordConfirm: '',
      success: false,
      err: false,
    };
    this.resetpassword = this.resetpassword.bind(this);
  }

  async resetpassword() {
    const {newPassword, passwordConfirm, key} = this.state;
    if (newPassword !== passwordConfirm) {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          clienterr: 'passwords do not match',
        });
      });
    } else {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {clienterr: false});
      });
      const {err} = await this.props.resetpassword(key, newPassword);
      if (err) {
        this.setState((prevState) => {
          return Object.assign({}, prevState, {
            success: false,
            err,
          });
        });
      } else {
        this.setState((prevState) => {
          return Object.assign({}, prevState, {
            success: true,
            err: false,
          });
        });
      }
    }
  }

  render() {
    const {success, err, clienterr, key} = this.state;
    const bar = (
      <Fragment>
        {success && (
          <Link to="/x/login">
            <Button outline>Sign in</Button>
          </Link>
        )}
        {!success && (
          <Link to="/x/login">
            <Button text>Cancel</Button>
          </Link>
        )}
        {!success && (
          <Button primary onClick={this.resetpassword}>
            Submit
          </Button>
        )}
      </Fragment>
    );

    return (
      <Section container padded>
        <Card
          center
          size="md"
          restrictWidth
          titleBar
          title={<h3>Reset password</h3>}
          bar={bar}
        >
          <Input
            label="code"
            fullWidth
            value={key}
            onChange={linkState(this, 'key')}
          />
          <Input
            label="new password"
            type="password"
            fullWidth
            onChange={linkState(this, 'newPassword')}
          />
          <Input
            label="confirm password"
            type="password"
            fullWidth
            onEnter={this.resetpassword}
            onChange={linkState(this, 'passwordConfirm')}
          />
          {!success && clienterr && <span>{clienterr}</span>}
          {!success && !clienterr && err && <span>{err}</span>}
          {success && (
            <span>
              <span>Your password has been reset</span>
            </span>
          )}
        </Card>
      </Section>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetpassword: (key, new_password) => {
      return dispatch(ConfirmResetReq(key, new_password));
    },
  };
};

ConfirmReset = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmReset);

export default ConfirmReset;
