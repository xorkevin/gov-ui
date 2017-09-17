import {h, Component} from 'preact';
import {withRouter} from 'react-router-dom';
import {Grid, Column} from 'component/grid';
import Section from 'component/section';
import Card from 'component/card';

import {connect} from 'preact-redux';
import {GetUserByName} from 'reducer/user';

class UserDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
      err: false,
      username: props.match.params.username || '',
      user: false,
    };
    this.fetchUser = this.fetchUser.bind(this);
  }

  fetchUser(){
    if(this.state.username.length > 0){
      this.props.userbyname(this.state.username, (err, user)=>{
        if(err){
          this.setState((prevState)=>{
            return Object.assign({}, prevState, {err});
          });
        } else {
          this.setState((prevState)=>{
            return Object.assign({}, prevState, {err: false, user});
          });
        }
      });
    }
  }

  componentDidMount(){
    this.fetchUser();
  }

  render({}, {err, username, user}){
    return <Section container padded>
      <Grid>
        <Column sm={8} md={6}>
          {user && <Card>
            <h4>{user.first_name} {user.last_name}</h4>
            <h5>{user.username}</h5>
          </Card>}
          {err && <span>{err}</span>}
        </Column>
        <Column sm={16} md={18}>
        </Column>
      </Grid>
    </Section>;
  }
}

const mapStateToProps = (state)=>{
  return {};
};

const mapDispatchToProps = (dispatch)=>{
  return {
    userbyname: async (username, callback)=>{
      const data = await dispatch(GetUserByName(username));
      if(data.err){
        callback(data.err);
      } else {
        callback(false, data.data);
      }
    },
  };
};

UserDetails = connect(mapStateToProps, mapDispatchToProps)(UserDetails);
UserDetails = withRouter(UserDetails);

export default UserDetails
