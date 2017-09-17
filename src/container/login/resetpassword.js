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
import {ConfirmResetReq} from 'reducer/account/forgotpassword';

class ConfirmReset extends Component {
  constructor(props){
    super(props);
    this.state = {
      key: props.match.params.key || '',
      newPassword: '',
      clienterr: false,
      passwordConfirm: '',
    };
    this.resetpassword = this.resetpassword.bind(this);
  }

  resetpassword(){
    const {newPassword, passwordConfirm, key} = this.state;
    if(newPassword !== passwordConfirm){
      this.setState((prevState)=>{
        return Object.assign({}, prevState, {clienterr: 'passwords do not match'});
      });
    } else {
      this.setState((prevState)=>{
        return Object.assign({}, prevState, {clienterr: false});
      });
      this.props.resetpassword(key, newPassword);
    }
  }

  render({success, config, err}, {key}){
    const bar = [];
    if(!success){
      bar.push(<Link to="/x/login"><Button text>Cancel</Button></Link>);
      bar.push(<Button primary onClick={this.resetpassword}>Submit</Button>);
    } else {
      bar.push(<Link to="/x/login"><Button outline>Sign in</Button></Link>);
    }

    return <Section container padded>
      <Card center size="md" restrictWidth titleBar title={[
        <h3>Reset password</h3>
      ]} bar={bar}>
        <Input label="code" fullWidth value={key} onChange={linkState(this, 'key')}/>
        <Input label="new password" type="password" fullWidth onChange={linkState(this, 'newPassword')}/>
        <Input label="confirm password" type="password" fullWidth onEnter={this.resetpassword} onChange={linkState(this, 'passwordConfirm')}/>
        {!success && err && <span>{err}</span>}
        {success && <span>
          <span>Your password has been reset</span>
        </span>}
      </Card>
    </Section>;
  }
}

const mapStateToProps = (state)=>{
  const {confirmsuccess, confirmerr} = state.ForgotPassword;
  return {
    success: confirmsuccess,
    err: confirmerr,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    resetpassword: (key, new_password)=>{
      dispatch(ConfirmResetReq(key, new_password));
    },
  };
};

ConfirmReset = connect(mapStateToProps, mapDispatchToProps)(ConfirmReset);
ConfirmReset = withRouter(ConfirmReset);

export default ConfirmReset
