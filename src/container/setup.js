import React, {Component, Fragment} from 'react';
import linkState from 'linkstate';
import Section from 'component/section';
import Menu from 'component/menu';
import FaIcon from 'component/faicon';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'react-redux';
import {SetupReq} from 'reducer/setup';

class SetupContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        orgname: '',
      },
      err: false,
      password_confirm: '',
      email_confirm: '',
      success: false,
      config: false,
    };
    this.setup = this.setup.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
  }

  navigateHome() {
    this.props.history.push('/');
  }

  setup() {
    const {password, email} = this.state.form;
    const {password_confirm, email_confirm} = this.state;
    if (password !== password_confirm) {
      return this.setState((prevState) => {
        return Object.assign({}, prevState, {
          err: 'passwords do not match',
          success: false,
        });
      });
    }
    if (email !== email_confirm) {
      return this.setState((prevState) => {
        return Object.assign({}, prevState, {
          err: 'emails do not match',
          success: false,
        });
      });
    }
    this.setState((prevState) => {
      return Object.assign({}, prevState, {err: false});
    });

    this.props.setup(this.state.form, (err, config) => {
      if (err) {
        return this.setState((prevState) => {
          return Object.assign({}, prevState, {err, success: false});
        });
      }
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          err: false,
          config,
          success: true,
        });
      });
    });
  }

  render() {
    const {success, config, err} = this.state;
    return (
      <Section container padded>
        <Card
          center
          size="md"
          restrictWidth
          titleBar
          title={<h3>Setup</h3>}
          bar={
            <Fragment>
              <Button text onClick={this.navigateHome}>
                Cancel
              </Button>
              <Button primary onClick={this.setup}>
                Submit
              </Button>
            </Fragment>
          }
        >
          <Section subsection sectionTitle="Organization">
            <Input
              label="organization name"
              fullWidth
              onChange={linkState(this, 'form.orgname')}
            />
          </Section>
          <Section subsection sectionTitle="Admin Account">
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
              onEnter={this.setup}
            />
          </Section>
          {err && <span>{err}</span>}
          {success && (
            <span>
              <span>{config.orgname} has been created</span>
              <Button outline onClick={this.navigateHome}>
                Finish
              </Button>
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
    setup: async (options, callback) => {
      const data = await dispatch(SetupReq(options));
      callback(data.err, data.data);
    },
  };
};

SetupContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SetupContainer);

export default SetupContainer;
