import {h, Component} from 'preact';
import Section from 'component/section';
import Card from 'component/card';
import Menu from 'component/menu';
import ListItem from 'component/list';
import Chip from 'component/chip';
import FaIcon from 'component/faicon';
import Button from 'component/button';
import Time from 'component/time';

import {connect} from 'preact-redux';
import {GetUserAccount} from 'reducer/auth';

class UserAccount extends Component {
  constructor(props){
    super(props);
    this.getaccount = this.getaccount.bind(this);
  }

  getaccount(){
    this.props.getaccount();
  }

  componentWillMount(){
    this.getaccount();
  }

  render({getuserloading, getusererr, userid, username, firstname, lastname, authTags, email, creationTime}){
    return <Section container narrow padded sectionTitle="Settings">
      {!getuserloading && getusererr && <span>{getusererr}</span>}
      {!getuserloading && <Card size="lg" restrictWidth center>
        <Section subsection sectionTitle="Account Details">
          <ListItem label="userid" item={userid}/>
          <ListItem label="username" item={username}/>
          <ListItem label="first name" item={firstname}/>
          <ListItem label="last name" item={lastname}/>
          <ListItem label="roles" item={authTags && authTags.split(',').map((tag)=>{return <Chip>{tag}</Chip>;})}/>
          <ListItem label="email" item={email}/>
          <ListItem label="creation time" item={<Time value={creationTime}/>}/>
        </Section>
      </Card>}
    </Section>;
  }
}

const mapStateToProps = (state)=>{
  const {
    getuserloading, getusererr,
    userid, username,
    firstname, lastname,
    authTags,
    email,
    creationTime
  } = state.Auth;
  return {
    getuserloading, getusererr,
    userid, username,
    firstname, lastname,
    authTags,
    email,
    creationTime,
  };
};

const mapDispatchToProps = (dispatch)=>{
  return {
    getaccount: ()=>{
      dispatch(GetUserAccount());
    },
  };
};

UserAccount = connect(mapStateToProps, mapDispatchToProps)(UserAccount);

export default UserAccount
