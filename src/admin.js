import {h, Component} from 'preact';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';

import Loader from 'loader';

import MainContent from 'component/maincontent';
import Navbar from 'component/navbar';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

class Admin extends Component {
  constructor(props){
    super(props);
    this.state = {
      dark: !!props.dark,
    };
  }

  setDark(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {dark: true});
    });
  }

  setLight(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {dark: false});
    });
  }

  toggleDark(){
    this.setState((prevState)=>{
      return Object.assign({}, prevState, {dark: !prevState.dark});
    });
  }

  render({}, {dark}){
    return <div>
      <Navbar sidebar left={[
        {key: 'home', component: <NavLink exact to="/"><FaIcon icon="home"/><small>Home</small></NavLink>},
        {key: 'health', component: <NavLink to="/health"><FaIcon icon="server"/><small>Health</small></NavLink>},
      ]} right={[
        {key: 'dark-mode', component: <span onClick={()=>{this.toggleDark();}}><FaIcon icon="bolt"/><small>Dark Mode</small></span>},
        {key: 'xorkevin', component: <Anchor ext href="https://github.com/xorkevin"><FaIcon icon="github"/><small>xorkevin</small></Anchor>},
      ]}>
      </Navbar>

      <MainContent withSidebar sectionNoMargin dark={dark}>
        <Switch>
          <Route exact path="/" component={Loader(()=>{return import('container/admin');}, (loaded, Admin)=>{
            if(loaded){
              return h(Admin);
            }
            return 'loading';
          })}/>
          <Route path="/health" component={Loader(()=>{return import('container/health');}, (loaded, Health)=>{
            if(loaded){
              return h(Health);
            }
            return 'loading';
          })}/>
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

export default Admin
