import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import Input from 'component/form';
import Button from 'component/button';
import ListItem from 'component/list';

import {connect} from 'react-redux';
import {EditPassReq} from 'reducer/account/edit';

class AccountPassEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      old_password: '',
      new_password: '',
      password_confirm: '',
      success: false,
      err: false,
      clienterr: false,
    };
    this.editpass = this.editpass.bind(this);
    this.navigateAccount = this.navigateAccount.bind(this);
  }

  navigateAccount() {
    this.props.history.replace('/a/account');
  }

  async editpass() {
    const {new_password, password_confirm} = this.state;
    if (new_password !== password_confirm) {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {
          clienterr: 'passwords do not match',
        });
      });
    } else {
      this.setState((prevState) => {
        return Object.assign({}, prevState, {clienterr: false});
      });
      const {err} = await this.props.editpass(
        this.state.old_password,
        this.state.new_password,
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
  }

  componentDidMount() {
    if (!this.props.userid) {
      this.navigateAccount();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.userid) {
      this.navigateAccount();
    }
  }

  render(
    {userid},
    {success, err, clienterr, old_password, new_password, password_confirm},
  ) {
    if (!userid) {
      return false;
    }
    const bar = [];
    if (success) {
      bar.push(
        <Link to="/a/account">
          <Button text>Back</Button>
        </Link>,
      );
    } else {
      bar.push(
        <Link to="/a/account">
          <Button text>Cancel</Button>
        </Link>,
      );
    }
    bar.push(
      <Button primary onClick={this.editpass}>
        Update
      </Button>,
    );
    return (
      <Card size="md" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Account Details">
          <ListItem label="userid" item={userid} />
          <Input
            fullWidth
            label="old password"
            type="password"
            value={old_password}
            onChange={linkstate(this, 'old_password')}
          />
          <Input
            fullWidth
            label="new password"
            type="password"
            value={new_password}
            onChange={linkstate(this, 'new_password')}
          />
          <Input
            fullWidth
            label="confirm password"
            type="password"
            value={password_confirm}
            onChange={linkstate(this, 'password_confirm')}
          />
        </Section>
        {!success && clienterr && <span>{clienterr}</span>}
        {!success && !clienterr && err && <span>{err}</span>}
        {success && <span>Password updated</span>}
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  const {userid} = state.Auth;
  return {
    userid,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editpass: (old_password, new_password) => {
      return dispatch(EditPassReq(old_password, new_password));
    },
  };
};

AccountPassEdit = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountPassEdit);

export default AccountPassEdit;
