import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import linkstate from 'linkstate';
import Section from 'component/section';
import Card from 'component/card';
import Input from 'component/form';
import Button from 'component/button';
import ListItem from 'component/list';

import {connect} from 'react-redux';
import {EditAccountReq} from 'reducer/account/edit';

class AccountDetailsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        username: props.username,
        first_name: props.firstname,
        last_name: props.lastname,
      },
      success: false,
      err: false,
    };
    this.editaccount = this.editaccount.bind(this);
    this.navigateAccount = this.navigateAccount.bind(this);
  }

  navigateAccount() {
    this.props.history.replace('/a/account');
  }

  async editaccount() {
    const {err} = await this.props.editaccount(this.state.options);
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
    const {success, err, options} = this.state;
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
      <Button primary onClick={this.editaccount}>
        Save
      </Button>,
    );
    return (
      <Card size="md" restrictWidth center bar={bar}>
        <Section subsection sectionTitle="Account Details">
          <ListItem label="userid" item={userid} />
          <Input
            fullWidth
            label="username"
            value={options.username}
            onChange={linkstate(this, 'options.username')}
          />
          <Input
            fullWidth
            label="first name"
            value={options.first_name}
            onChange={linkstate(this, 'options.first_name')}
          />
          <Input
            fullWidth
            label="last name"
            value={options.last_name}
            onChange={linkstate(this, 'options.last_name')}
          />
        </Section>
        {err && <span>{err}</span>}
        {success && <span>Changes saved</span>}
      </Card>
    );
  }
}

const mapStateToProps = (state) => {
  const {userid, username, firstname, lastname} = state.Auth;
  return {
    userid,
    username,
    firstname,
    lastname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editaccount: (options) => {
      return dispatch(EditAccountReq(options));
    },
  };
};

AccountDetailsEdit = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AccountDetailsEdit);

export default AccountDetailsEdit;
