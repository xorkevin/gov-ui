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
import {ConfirmAccountReq} from 'reducer/account/create';

class ConfirmAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      err: false,
      key: props.match.params.key || '',
    };
    this.confirmaccount = this.confirmaccount.bind(this);
  }

  async confirmaccount() {
    const {err} = await this.props.confirmaccount(this.state.key);
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
    const {key, success, err} = this.state;
    const bar = (
      <Fragment>
        {!success && (
          <Link to="/x/login">
            <Button text>Cancel</Button>
          </Link>
        )}
        {!success && (
          <Button primary onClick={this.confirmaccount}>
            Submit
          </Button>
        )}
        {success && (
          <Link to="/x/login">
            <Button outline>Sign in</Button>
          </Link>
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
          title={<h3>Confirm account</h3>}
          bar={bar}
        >
          <Input
            label="code"
            fullWidth
            value={key}
            onChange={linkState(this, 'key')}
          />
          {!success && err && <span>{err}</span>}
          {success && (
            <span>
              <span>Your account has been created</span>
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
    confirmaccount: (key) => {
      return dispatch(ConfirmAccountReq(key));
    },
  };
};

ConfirmAccount = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmAccount);

export default ConfirmAccount;
