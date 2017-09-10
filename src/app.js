import {h, Component} from 'preact';
import {Switch, Route, Redirect, NavLink} from 'react-router-dom';

import Loader from 'loader';

import MainContent from 'component/maincontent';
import Navbar from 'component/navbar';
import Footer from 'component/footer';
import Grid from 'component/grid';
import Anchor from 'component/anchor';
import FaIcon from 'component/faicon';

class App extends Component {
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
      <Navbar left={[
        {key: 'home', home: true, component: <NavLink exact to="/">Home</NavLink>},
        {key: 'form', component: <NavLink to="/form">Form</NavLink>},
        {key: 'cards', component: <NavLink to="/cards">Cards</NavLink>},
        {key: 'health', component: <NavLink to="/health">Health</NavLink>},
      ]} right={[
        {key: 'contact', component: <span onClick={()=>{this.toggleDark();}}><FaIcon icon="bolt"/> Dark Mode</span>},
        {key: 'xorkevin', component: <Anchor ext href="https://github.com/xorkevin"><FaIcon icon="github"/> xorkevin</Anchor>},
      ]}>
      </Navbar>

      <MainContent dark={dark}>
        <Switch>
          <Route exact path="/" component={Loader(()=>{return import('container/home');}, (loaded, Home)=>{
            if(loaded){
              return h(Home);
            }
            return 'loading';
          })}/>
          <Route path="/form" component={Loader(()=>{return import('container/form');}, (loaded, Form)=>{
            if(loaded){
              return h(Form);
            }
            return 'loading';
          })}/>
          <Route path="/cards" component={Loader(()=>{return import('container/card');}, (loaded, Card)=>{
            if(loaded){
              return h(Card);
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
  }
}

export default App
