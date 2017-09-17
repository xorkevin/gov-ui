import {h, Component} from 'preact';
import {Link, withRouter} from 'react-router-dom';
import linkState from 'linkstate';
import Section from 'component/section';
import Menu from 'component/menu';
import FaIcon from 'component/faicon';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'preact-redux';
import {ConfirmAccountReq} from 'reducer/account/create';

class ConfirmAccount extends Component {
  constructor(props){
    super(props);
    this.state = {
      key: props.match.params.key || '',
    };
    this.confirmaccount = this.confirmaccount.bind(this);
  }

  confirmaccount(){
    this.props.confirmaccount(this.state.key);
  }

  render({success, config, err}, {key}){
    const bar = [];
    if(!success){
      bar.push(<Link to="/x/login"><Button text>Cancel</Button></Link>);
      bar.push(<Button primary onClick={this.confirmaccount}>Submit</Button>);
    } else {
      bar.push(<Link to="/x/login"><Button outline>Sign in</Button></Link>);
    }
    return <Section container padded>
      <Card center size="md" restrictWidth titleBar title={[
        <h3>Confirm account</h3>
      ]} bar={bar}>
        <Input label="code" fullWidth value={key} onChange={linkState(this, 'key')}/>
        {!success && err && <span>{err}</span>}
        {success && <span>
          <span>Your account has been created</span>
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
