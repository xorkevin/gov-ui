import {h, Component} from 'preact';
import linkstate from 'linkstate';
import {withRouter} from 'react-router-dom';
import Section from 'component/section';
import Card from 'component/card';
import ListItem from 'component/list';
import Chip from 'component/chip';
import Time from 'component/time';
import Button from 'component/button';
import Input from 'component/form';

import {connect} from 'preact-redux';
import {GetUserAccountByName} from 'reducer/user';

class ManageUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      err: false,
      username: props.match.params.username || '',
      user: false,
    };
    this.fetchUser = this.fetchUser.bind(this);
    this.navigateUser = this.navigateUser.bind(this);
  }

  navigateUser(){
    if(this.state.username.length > 0){
      this.props.history.push(`/manage/user/${this.state.username}`);
    }
  }

  fetchUser(){
    if(this.state.username.length > 0){
      this.props.userbyname(this.state.username, (err, user)=>{
        this.setState((prevState)=>{
          return Object.assign({}, prevState, {err, user});
        });
      });
    }
  }

  componentDidMount(){
    this.fetchUser();
  }

  render({}, {err, username, user}){
    const bar = [];
    if(!user){
      bar.push(<Button primary onClick={this.navigateUser}>Search</Button>);
    }
    return <div>
      {user && <Card size="lg" restrictWidth center>
        <Section subsection sectionTitle="Account Details">
          <ListItem label="userid" item={user.userid}/>
          <ListItem label="username" item={user.username}/>
          <ListItem label="first name" item={user.first_name}/>
          <ListItem label="last name" item={user.last_name}/>
          <ListItem label="roles" item={user.auth_tags.split(',').map((tag)=>{return <Chip>{tag}</Chip>;})}/>
          <ListItem label="creation time" item={<Time value={user.creation_time}/>}/>
        </Section>
      </Card>}
      {!user && <Card size="md" restrictWidth center>
        <Section subsection sectionTitle="Search User">
          <Input fullWidth label="username" error={err}
            onChange={linkstate(this, 'username')} onEnter={this.navigateUser}/>
        </Section>
      </Card>}
    </div>;
  }
}

const mapStateToProps = (state)=>{
  return {};
};

const mapDispatchToProps = (dispatch)=>{
  return {
    userbyname: async (username, callback)=>{
      const data = await dispatch(GetUserAccountByName(username));
      callback(data.err, data.data);
    },
  };
};

ManageUser = connect(mapStateToProps, mapDispatchToProps)(ManageUser);
ManageUser = withRouter(ManageUser);

export default ManageUser
