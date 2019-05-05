import React, {Component, Fragment} from 'react';
import {Link} from 'react-router-dom';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import Input from 'component/form';
import Button from 'component/button';
import ListItem from 'component/list';

import {connect} from 'react-redux';
import {EditEmailReq} from 'reducer/account/edit';

class AccountEmailEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      success: false,
      err: false,
    };
    this.editemail = this.editemail.bind(this);
    this.navigateAccount = this.navigateAccount.bind(this);
  }

  navigateAccount() {
    this.props.history.replace('/a/account');
  }

  async editemail() {
    const {err} = await this.props.editemail(
      this.state.email,
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

  render() {
    const {userid} = this.props;
    const {success, err, email, password} = this.state;
    if (!userid) {
      return false;
    }
    const bar = (
      <Fragment>
        {success && (
          <Link to="/a/account/email/confirm">
            <Button outline>Confirm</Button>
          </Link>
        )}
        {!success && (
          <Link to="/a/account">
            <Button text>Cancel</Button>
          </Link>
        )}
        {!success && (
          <Button primary onClick={this.editemail}>
            Update
          </Button>
        )}
      </Fragment>
    );

    return (
      <Card size="md" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Account Details">
          <ListItem label="userid" item={userid} />
          <Input
            fullWidth
            label="email"
            value={email}
            onChange={linkstate(this, 'email')}
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
        {success && (
          <span>
            Confirm your email change with a code emailed to the address
            provided above
          </span>
        )}
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
    editemail: (email, password) => {
      return dispatch(EditEmailReq(email, password));
    },
  };
};

AccountEmailEdit = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountEmailEdit);

export default AccountEmailEdit;
