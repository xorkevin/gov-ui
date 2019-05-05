import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import linkState from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'react-redux';
import {CreateAccountReq} from 'reducer/account/create';

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
      },
      success: false,
      err: false,
      clienterr: false,
      password_confirm: '',
      email_confirm: '',
    };
    this.createaccount = this.createaccount.bind(this);
  }

  async createaccount() {
    const {password, email} = this.state.form;
    const {password_confirm, email_confirm} = this.state;
    if (password !== password_confirm) {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          clienterr: 'passwords do not match',
        });
      });
    } else if (email !== email_confirm) {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {clienterr: 'emails do not match'});
      });
    } else {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {clienterr: false});
      });
      const {err} = await this.props.createaccount(this.state.form);
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
    const {success, err, clienterr} = this.state;
    const bar = (
      <Fragment>
        {success && (
          <Link to="/x/confirm">
            <Button outline>Confirm</Button>
          </Link>
        )}
        {!success && (
          <Link to="/x/login">
            <Button text>Cancel</Button>
          </Link>
        )}
        {!success && (
          <Button primary onClick={this.createaccount}>
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
          title={<h3>Sign up</h3>}
          bar={bar}
        >
          <Input
            label="first name"
            fullWidth
            onChange={linkState(this, 'form.first_name')}
          />
          <Input
            label="last name"
            fullWidth
            onChange={linkState(this, 'form.last_name')}
          />
          <Input
            label="username"
            fullWidth
            onChange={linkState(this, 'form.username')}
          />
          <Input
            label="password"
            type="password"
            fullWidth
            onChange={linkState(this, 'form.password')}
          />
          <Input
            label="confirm password"
            type="password"
            fullWidth
            onChange={linkState(this, 'password_confirm')}
          />
          <Input
            label="email"
            fullWidth
            onChange={linkState(this, 'form.email')}
          />
          <Input
            label="confirm email"
            fullWidth
            onChange={linkState(this, 'email_confirm')}
            onEnter={this.createaccount}
          />
          {!success && clienterr && <span>{clienterr}</span>}
          {!success && !clienterr && err && <span>{err}</span>}
          {success && (
            <span>
              <span>
                Confirm your account with a code emailed to the address you
                provided above
              </span>
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
    createaccount: (options) => {
      return dispatch(CreateAccountReq(options));
    },
  };
};

CreateAccount = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateAccount);

export default CreateAccount;
