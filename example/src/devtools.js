import {useCallback} from 'react';
import {Switch, Route, Redirect, useRouteMatch} from 'react-router-dom';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  Sidebar,
  SidebarItem,
  SidebarHeader,
  Field,
  Form,
  useForm,
} from '@xorkevin/nuke';

const OAuthTool = () => {
  const form = useForm({
    clientid: '',
  });

  const onSubmit = useCallback(() => {
    console.log('sent auth request');
  }, []);

  return (
    <div>
      <h3>OAuth Tester</h3>
      <Form formState={form.State} onChange={form.update} onSubmit={onSubmit}>
        <Field name="clientid" label="Client ID" nohint />
      </Form>
    </div>
  );
};

const OAuthCBTool = () => {
  return (
    <div>
      <h3>OAuth Callback Tester</h3>
    </div>
  );
};

const DevToolsContainer = () => {
  const match = useRouteMatch();
  return (
    <MainContent>
      <Section>
        <Container padded>
          <Grid>
            <Column fullWidth md={6}>
              <Sidebar>
                <SidebarHeader>Devtools</SidebarHeader>
                <SidebarItem local link={`${match.url}/oauth`}>
                  OAuth
                </SidebarItem>
              </Sidebar>
            </Column>
            <Column fullWidth md={18}>
              <Switch>
                <Route exact path={`${match.path}/oauth`}>
                  <OAuthTool />
                </Route>
                <Route exact path={`${match.path}/oauth/cb`}>
                  <OAuthCBTool />
                </Route>
                <Redirect to={`${match.url}/oauth`} />
              </Switch>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default DevToolsContainer;
