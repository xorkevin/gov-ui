import {h, Component} from 'preact';
import {Switch, Route, Redirect, NavLink, withRouter} from 'react-router-dom';
import {connect} from 'preact-redux';

import {DarkMode} from 'reducer/settings';

import Loader from 'loader';
import Protected from 'protected';

import MainContent from 'component/maincontent';
import Navbar from 'component/navbar';
import Menu from 'component/menu';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

class Admin extends Component {
  constructor(props){
    super(props);
    this.toggleDark = this.toggleDark.bind(this);
  }

  toggleDark(){
    this.props.toggleDark();
  }

  render({}, {dark}){
    return <div>
      <Navbar sidebar left={[
        {key: 'home', home: true, component: <NavLink exact to="/"><FaIcon icon="home"/><small>Home</small></NavLink>},
        {key: 'health', component: <NavLink to="/health"><FaIcon icon="server"/><small>Health</small></NavLink>},
      ]} right={[
        {key: 'settings', component: <Menu icon={[<FaIcon icon="cog"/>, <small>Settings</small>]} size="md" fixed align="left" position="top">
          <span onClick={this.toggleDark}><FaIcon icon="bolt"/> Dark Mode</span>
          <Anchor ext href="https://github.com/xorkevin"><FaIcon icon="github"/> xorkevin</Anchor>
        </Menu>},
      ]}/>

      <MainContent withSidebar sectionNoMargin>
        <Switch>
          <Route exact path="/" component={Protected(Loader(()=>{return import('container/admin');}))}/>
          <Route path="/a" component={Loader(()=>{return import('container/account');})}/>
          <Route path="/health" component={Protected(Loader(()=>{return import('container/health');}))}/>
          <Route path="/setup" component={Loader(()=>{return import('container/setup');})}/>
          <Redirect to="/"/>
        </Switch>
      </MainContent>

      <Footer withSidebar>
        <Grid center sm={8}>
          <div colkey="left" className="text-center">
           <h4>Nuke</h4>
           a reactive frontend for governor
          </div>
          <div colkey="center" className="text-center">
            <ul>
              <li><Anchor noColor ext href="https://github.com/hackform/nuke"><FaIcon icon="github"/> Github</Anchor></li>
              <li>Designed for <Anchor noColor ext href="https://github.com/hackform/governor">hackform/governor</Anchor></li>
            </ul>
          </div>
          <div colkey="right" className="text-center">
            <h5>
              <FaIcon icon="code"/> with <FaIcon icon="heart-o"/> by <Anchor noColor ext href="https://github.com/xorkevin"><FaIcon icon="github"/> xorkevin</Anchor>
            </h5>
          </div>
        </Grid>
      </Footer>
    </div>;
  }
}

const mapStateToProps = (state)=>{
  return {};
};

const mapDispatchToProps = (dispatch)=>{
  return {
    toggleDark: ()=>{
      dispatch(DarkMode());
    },
  };
};

Admin = connect(mapStateToProps, mapDispatchToProps)(Admin);
Admin = withRouter(Admin);

export default Admin
