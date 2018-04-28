import {h, Component} from 'preact';
import {connect} from 'preact-redux';

const mapStateToProps = state => {
  const {loggedIn, authTags} = state.Auth;
  return {
    loggedIn,
    authTags,
  };
};

const Protected = (child, auth, args) => {
  return connect(mapStateToProps)(
    class extends Component {
      // '/x/login'
      render(props) {
        const {loggedIn, authTags} = props;
        if (!loggedIn || (auth && !new Set(authTags.split(',')).has(auth))) {
          return <div>Unauthorized</div>;
        }
        return h(child, Object.assign({}, props, args));
      }
    },
  );
};

export default Protected;
