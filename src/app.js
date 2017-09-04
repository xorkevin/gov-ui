import 'font-awesome/css/font-awesome.min.css';
import 'main.scss';

import {h} from 'preact';
import {Switch, Route, NavLink} from 'react-router-dom';

import Loader from 'loader';

import MainContent from 'component/maincontent';
import Navbar from 'component/navbar';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

const App = ({match})=>{
  return <div>
    <Navbar left={[
      {key: 'home', component: <NavLink exact to="/">Home</NavLink>},
      {key: 'form', component: <NavLink to="/form">Form</NavLink>},
      {key: 'cards', component: <NavLink to="/cards">Cards</NavLink>},
    ]} right={[
      {key: 'contact', component: 'Contact'},
      {key: 'xorkevin', component: <Anchor ext href="https://github.com/xorkevin"><FaIcon icon="github"/> xorkevin</Anchor>},
    ]}>
    </Navbar>

    <MainContent>
      <Switch>
        <Route exact path="/" component={Loader('container/home', (loaded, Home)=>{
          if(loaded){
            return h(Home);
          }
          return 'loading';
        })}/>
        <Route path="/form" component={Loader('container/form', (loaded, Form)=>{
          if(loaded){
            return h(Form);
          }
          return 'loading';
        })}/>
        <Route path="/cards" component={Loader('container/card', (loaded, Card)=>{
          if(loaded){
            return h(Card);
          }
          return 'loading';
        })}/>
      </Switch>
    </MainContent>

    <Footer>
      <Grid center md={6} sm={8}>
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

export default App
