import {h, Component} from 'preact';
import {withRouter} from 'react-router-dom';
import linkState from 'linkstate';
import Section from 'component/section';
import Menu from 'component/menu';
import FaIcon from 'component/faicon';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'preact-redux';
import {ConfirmAccountReq} from 'reducer/createaccount';

class ConfirmAccount extends Component {
  constructor(props){
    super(props);
    this.state = {
      key: props.match.params.key || '',
    };
    this.confirmaccount= this.confirmaccount.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
  }

  navigateHome(){
    this.props.history.push('/');
  }

  confirmaccount(){
    this.props.confirmaccount(this.state.key);
  }

  render({success, config, err}, {key}){
    return <Section container padded>
      <Card center size="md" restrictWidth titleBar title={[
        <h3>Confirm account</h3>
      ]} bar={[
        <Button text onClick={this.navigateHome}>Cancel</Button>, <Button primary onClick={this.confirmaccount}>Submit</Button>
      ]}>
        <Input label="code" fullWidth value={key} onChange={linkState(this, 'key')}/>
        {!success && err && <span>{err}</span>}
        {success && <span>
          <span>Your account has been created</span>
          <Button outline onClick={this.navigateHome}>Sign in</Button>
        </span>}
      </Card>
    </Section>;
  }
}

const mapStateToProps = (state)=>{
  const {confirmsuccess, confirmconfig, confirmerr} = state.CreateAccount;
  return {
    success: confirmsuccess,
    config: confirmconfig,
    err: confirmerr,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    confirmaccount: (key)=>{
      dispatch(ConfirmAccountReq(key));
    },
  };
};

ConfirmAccount = connect(mapStateToProps, mapDispatchToProps)(ConfirmAccount);
ConfirmAccount = withRouter(ConfirmAccount);

export default ConfirmAccount
