import {h, Component} from 'preact';
import {connect} from 'preact-redux';
import {withRouter} from 'react-router-dom';

const mapStateToProps = (state)=>{
  const {loggedIn} = state.Auth;
  return {
    loggedIn,
  };
};

const Protected = (child)=>{
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

    render({loggedIn}){
      if(loggedIn){
        return h(child);
      }
      return false;
    }
  }));
};

export default Protected
