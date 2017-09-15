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
import {ForgotPasswordReq} from 'reducer/forgotpassword';

class ForgotContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
    };
    this.forgotpassword = this.forgotpassword.bind(this);
    this.navigateLogin = this.navigateLogin.bind(this);
    this.navigateConfirm = this.navigateConfirm.bind(this);
  }

  navigateLogin(){
    this.props.history.push('/a/login');
  }

  navigateConfirm(){
    this.props.history.push('/a/forgotconfirm');
  }

  forgotpassword(){
    this.props.forgotpassword(this.state.username);
  }

  render({success, config, err}){
    const bar = [];
    if(!success){
      bar.push(<Button text onClick={this.navigateLogin}>Cancel</Button>);
      bar.push(<Button primary onClick={this.confirmaccount}>Submit</Button>);
    } else {
      bar.push(<Button outline onClick={this.navigateConfirm}>Confirm</Button>);
    }

    return <Section container padded>
      <Card center size="md" restrictWidth titleBar title={[
        <h3>Forgot password</h3>
      ]} bar={bar}>
        <Input label="username" fullWidth onEnter={this.forgotpassword} onChange={linkState(this, 'username')}/>
        {!success && err && <span>{err}</span>}
        {success && <span>
          <span>Reset your password with a code emailed to you</span>
        </span>}
      </Card>
    </Section>;
  }
}

const mapStateToProps = (state)=>{
  const {success, err} = state.ForgotPassword;
  return {
    success, err,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    forgotpassword: (username)=>{
      dispatch(ForgotPasswordReq(username));
    },
  };
};

ForgotContainer = connect(mapStateToProps, mapDispatchToProps)(ForgotContainer);
ForgotContainer = withRouter(ForgotContainer);

export default ForgotContainer
