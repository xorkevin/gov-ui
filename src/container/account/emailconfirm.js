import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import Input from 'component/form';
import Button from 'component/button';
import ListItem from 'component/list';

import {connect} from 'react-redux';
import {ConfirmEmailReq} from 'reducer/account/edit';

class AccountEmailConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: props.match.params.key || '',
      password: '',
      success: false,
      err: false,
    };
    this.confirmemail = this.confirmemail.bind(this);
    this.navigateAccount = this.navigateAccount.bind(this);
  }

  navigateAccount() {
    this.props.history.replace('/a/account');
  }

  async confirmemail() {
    const {err} = await this.props.confirmemail(
      this.state.key,
      this.state.password,
    );
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
    const {success, err, key, password} = this.state;
    const bar = (
      <Fragment>
        <Link to="/a/account">
          <Button text>Cancel</Button>
        </Link>
        <Button primary onClick={this.confirmemail}>
          Update
        </Button>
      </Fragment>
    );
    return (
      <Card size="md" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Account Details">
          <Input
            fullWidth
            label="code"
            value={key}
            onChange={linkstate(this, 'key')}
          />
          <Input
            fullWidth
            label="password"
            type="password"
            value={password}
            onChange={linkstate(this, 'password')}
          />
        </Section>
        {err && <span>{err}</span>}
        {success && <span>Email updated</span>}
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    confirmemail: (key, password) => {
      return dispatch(ConfirmEmailReq(key, password));
    },
  };
};

AccountEmailConfirm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountEmailConfirm);

export default AccountEmailConfirm;
