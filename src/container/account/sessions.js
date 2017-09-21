import {h, Component} from 'preact';
import {Link, withRouter} from 'react-router-dom';
import Section from 'component/section';
import Card from 'component/card';
import Input from 'component/form';
import Button from 'component/button';
import ListItem from 'component/list';
import Time from 'component/time';

import {connect} from 'preact-redux';
import {GetSessionReq} from 'reducer/account/edit';

class AccountSessions extends Component {
  constructor(props){
    super(props);
    this.state = {
      session_ids: new Set(),
    };
    this.deletesessions = this.deletesessions.bind(this);
    this.getsessions = this.getsessions.bind(this);
  }

  deletesessions(){
    console.log('delete', Array.from(this.state.session_ids));
    //this.props.deletesessions(this.state);
  }

  getsessions(){
    this.props.getsessions();
  }

  componentDidMount(){
    this.getsessions();
  }

  render({success, err, sessions}, {session_ids}){
    if(!sessions){
      return false;
    }
    const bar = [];
    bar.push(<Button primary onClick={this.deletesessions}>Delete</Button>);
    return <Card size="lg" restrictWidth center bar={bar}>
      <Section subsection sectionTitle="Active Sessions">
        {sessions.map((session)=>{
          return <div>
            <Input fullWidth type="checkbox" label={
              <span>{session.ip} | last accessed <Time value={session.time * 1000}/></span>
            } onChange={(value)=>{
              this.setState((prevState)=>{
                if(prevState.session_ids.has(session.session_id)){
                  prevState.session_ids.delete(session.session_id);
                  return Object.assign({}, prevState, {
                    session_ids: prevState.session_ids,
                  });
                } else {
                  return Object.assign({}, prevState, {
                    session_ids: prevState.session_ids.add(session.session_id),
                  });
                }
              });
            }}/>
            <span>{session.user_agent}</span>
          </div>;
        })}
      </Section>
      {err && <span>{err}</span>}
    </Card>;
  }
}

const mapStateToProps = (state)=>{
  const {success, err, sessions} = state.EditAccount;
  return {
    success, err, sessions,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    getsessions: ()=>{
      dispatch(GetSessionReq());
    },
  };
};

AccountSessions = connect(mapStateToProps, mapDispatchToProps)(AccountSessions);
AccountSessions = withRouter(AccountSessions);

export default AccountSessions
