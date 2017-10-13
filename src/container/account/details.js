import {h, Component} from 'preact';
import {Link} from 'react-router-dom';
import Section from 'component/section';
import Card from 'component/card';
import ListItem from 'component/list';
import Chip from 'component/chip';
import Button from 'component/button';
import Time from 'component/time';

import {connect} from 'preact-redux';
import {GetUserAccount} from 'reducer/account/auth';

class AccountDetails extends Component {
  constructor(props){
    super(props);
    this.getaccount = this.getaccount.bind(this);
  }

  getaccount(){
    this.props.getaccount();
  }

  componentDidMount(){
    this.getaccount();
  }

  render({getuserloading, getusererr, userid, username, firstname, lastname, authTags, email, creationTime}){
    const bar = [];
    bar.push(<Link to="/a/account/edit"><Button outline>Edit</Button></Link>);
    bar.push(<Link to="/a/account/email"><Button outline>Change Email</Button></Link>);
    bar.push(<Link to="/a/account/pass"><Button outline>Change Password</Button></Link>);

    return <div>
      {!getuserloading && getusererr && <span>{getusererr}</span>}
      {!getuserloading && <Card size="lg" restrictWidth center bar={bar}>
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
    </div>;
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

AccountDetails = connect(mapStateToProps, mapDispatchToProps)(AccountDetails);

export default AccountDetails
