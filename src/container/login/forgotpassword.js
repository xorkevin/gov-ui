import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import linkState from 'linkstate';
import Section from 'component/section';
import Menu from 'component/menu';
import FaIcon from 'component/faicon';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'react-redux';
import {ForgotPasswordReq} from 'reducer/account/forgotpassword';

class ForgotContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      success: false,
      err: false,
    };
    this.forgotpassword = this.forgotpassword.bind(this);
  }

  async forgotpassword() {
    const {err} = await this.props.forgotpassword(this.state.username);
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

  render() {
    const {success, err} = this.state;
    const bar = (
      <Fragment>
        {success && (
          <Link to="/x/forgotconfirm">
            <Button outline>Confirm</Button>
          </Link>
        )}
        {!success && (
          <Link to="/x/login">
            <Button text>Cancel</Button>
          </Link>
        )}
        {!success && (
          <Button primary onClick={this.forgotpassword}>
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
          title={<h3>Forgot password</h3>}
          bar={bar}
        >
          <Input
            label="username / email"
            fullWidth
            onEnter={this.forgotpassword}
            onChange={linkState(this, 'username')}
          />
          {err && <span>{err}</span>}
          {success && (
            <span>
              <span>Reset your password with a code emailed to you</span>
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
    forgotpassword: (username) => {
      return dispatch(ForgotPasswordReq(username));
    },
  };
};

ForgotContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotContainer);

export default ForgotContainer;
