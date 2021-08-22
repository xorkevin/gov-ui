import {
  Switch,
  Route,
  Redirect,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import {Grid, Column, ListGroup, ListItem} from '@xorkevin/nuke';

const SelectAChat = () => {
  return <div>Select a chat</div>;
};

const Chat = () => {
  const {chatid} = useParams();

  return <div>Hello, World, chatid: {chatid}</div>;
};

const ConduitChat = () => {
  const match = useRouteMatch();
  return (
    <Grid>
      <Column fullWidth sm={6}>
        <h4>Direct Messages</h4>
        <ListGroup>
          <ListItem>Gandalf the Grey</ListItem>
        </ListGroup>
      </Column>
      <Column fullWidth sm={18}>
        <Switch>
          <Route exact path={`${match.path}`}>
            <SelectAChat />
          </Route>
          <Route path={`${match.path}/:chatid`}>
            <Chat />
          </Route>
          <Redirect to={`${match.url}`} />
        </Switch>
      </Column>
    </Grid>
  );
};

export default ConduitChat;
