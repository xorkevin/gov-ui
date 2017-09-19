import {h, Component} from 'preact';
import {Switch, Route, Redirect, NavLink, withRouter} from 'react-router-dom';
import Section from 'component/section';
import Tabbar from 'component/tabbar';

import Loader from 'loader';

class ManageContainer extends Component {
  render({match}){
    return <Section container narrow padded sectionTitle="Settings">
      <Tabbar left={[
        {key: 'user', component: <NavLink to={`${match.path}/user`}>Account</NavLink>},
      ]}/>
      <Switch>
        <Route path={`${match.url}/user/:username?`}
          component={Loader(()=>{return import('container/manage/user');})}/>
        <Redirect to={`${match.url}/user`}/>
      </Switch>
    </Section>;
  }
}

ManageContainer = withRouter(ManageContainer);

export default ManageContainer
