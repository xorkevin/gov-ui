import {h} from 'preact';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';

import Loader from 'loader';

import MainContent from 'component/maincontent';
import Navbar from 'component/navbar';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

const Admin = ({match})=>{
  return <div>
    <Navbar left={[
      {key: 'home', component: <NavLink exact to="/">Admin</NavLink>},
      {key: 'health', component: <NavLink to="/health">Health</NavLink>},
    ]} right={[
      {key: 'xorkevin', component: <Anchor ext href="https://github.com/xorkevin"><FaIcon icon="github"/> xorkevin</Anchor>},
    ]}>
    </Navbar>

    <MainContent>
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

    <Footer>
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
};

export default Admin
