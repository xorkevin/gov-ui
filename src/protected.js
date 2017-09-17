import {h, Component} from 'preact';
import {withRouter} from 'react-router-dom';
import {connect} from 'preact-redux';

const mapStateToProps = (state)=>{
  const {loggedIn, authTags} = state.Auth;
  return {
    loggedIn, authTags,
  };
};

const Protected = (child, auth)=>{
  return withRouter(connect(mapStateToProps)(class extends Component {
    componentWillMount(){
      if(!this.props.loggedIn){
        this.props.history.replace('/a/login');
      }
    }

    componentWillReceiveProps(nextProps){
      if(!nextProps.loggedIn){
        this.props.history.replace('/a/login');
      }
    }

    render({loggedIn, authTags}){
      if(!loggedIn){
        return false;
      }
      if(auth && !(new Set(authTags.split(',')).has(auth))){
        return <div>Unauthorized</div>;
      }
      return h(child);
    }
  }));
};

export default Protected
