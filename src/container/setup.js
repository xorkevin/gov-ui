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
import {SetupReq} from 'reducer/setup';

class SetupContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      form: {
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        orgname: '',
      },
      clienterr: false,
      password_confirm: '',
      email_confirm: '',
    };
    this.setup = this.setup.bind(this);
    this.navigateHome = this.navigateHome.bind(this);
  }

  navigateHome(){
    this.props.history.replace('/');
  }

  setup(){
    console.log(this.state);
    const {password, email} = this.state.form;
    const {password_confirm, email_confirm} = this.state;
    if(password !== password_confirm){
      this.setState((prevState)=>{
        return Object.assign({}, prevState, {clienterr: 'passwords do not match'});
      });
    } else if(email !== email_confirm){
      this.setState((prevState)=>{
        return Object.assign({}, prevState, {clienterr: 'emails do not match'});
      });
    } else {
      this.setState((prevState)=>{
        return Object.assign({}, prevState, {clienterr: false});
      });
      this.props.setup(this.state.form);
    }
  }

  render({success, config, err}, {clienterr}){
    return <Section container padded>
      <Card center size="md" restrictWidth titleBar title={[
        <h3>Setup</h3>
      ]} bar={[
        <Button text>Cancel</Button>, <Button primary onClick={this.setup}>Submit</Button>
      ]}>
        <Section subsection sectionTitle="Organization">
          <Input label="organization name" fullWidth onChange={linkState(this, 'form.orgname')}/>
        </Section>
        <Section subsection sectionTitle="Admin Account">
          <Input label="first name" fullWidth onChange={linkState(this, 'form.first_name')}/>
          <Input label="last name" fullWidth onChange={linkState(this, 'form.last_name')}/>
          <Input label="username" fullWidth onChange={linkState(this, 'form.username')}/>
          <Input label="password" type="password" fullWidth onChange={linkState(this, 'form.password')}/>
          <Input label="confirm password" type="password" fullWidth onChange={linkState(this, 'password_confirm')}/>
          <Input label="email" fullWidth onChange={linkState(this, 'form.email')}/>
          <Input label="confirm email" fullWidth onChange={linkState(this, 'email_confirm')} onEnter={this.setup}/>
        </Section>
        {!success && clienterr && <span>{clienterr}</span>}
        {!success && !clienterr && err && <span>{err}</span>}
        {success && <span>
          <span>{config.orgname} has been created</span>
          <Button text onClick={this.navigateHome}>Finish</Button>
        </span>}
      </Card>
    </Section>;
  }
}

const mapStateToProps = (state)=>{
  const {success, config, err} = state.Setup;
  return {
    success, config, err,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    setup: (options)=>{
      dispatch(SetupReq(options));
    },
  };
};

SetupContainer = connect(mapStateToProps, mapDispatchToProps)(SetupContainer);
SetupContainer = withRouter(SetupContainer);

export default SetupContainer
