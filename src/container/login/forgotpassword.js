import {h, Component} from 'preact';
import {Link} from 'react-router-dom';
import linkState from 'linkstate';
import Section from 'component/section';
import Menu from 'component/menu';
import FaIcon from 'component/faicon';
import Card from 'component/card';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'preact-redux';
import {ForgotPasswordReq} from 'reducer/account/forgotpassword';

class ForgotContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
    };
    this.forgotpassword = this.forgotpassword.bind(this);
  }

  forgotpassword(){
    this.props.forgotpassword(this.state.username);
  }

  render({success, config, err}){
    const bar = [];
    if(!success){
      bar.push(<Link to="/x/login"><Button text>Cancel</Button></Link>);
      bar.push(<Button primary onClick={this.confirmaccount}>Submit</Button>);
    } else {
      bar.push(<Link to="/x/forgotconfirm"><Button outline>Confirm</Button></Link>);
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

export default ForgotContainer
