import React, {Fragment, useEffect} from 'react';
import {useResource} from '@xorkevin/substation';
import {
  MainContent,
  Section,
  Container,
  Grid,
  Column,
  Card,
  Time,
  FaIcon,
} from '@xorkevin/nuke';

const REFRESH_TIME = 5;

const selectAPIHealth = (api) => api.healthz.ready;

const AdminContainer = () => {
  const [health, execHealth] = useResource(selectAPIHealth, [], {
    time: 0,
    errs: [],
  });

  useEffect(() => {
    const interval = setInterval(execHealth, REFRESH_TIME * 1000);
    return () => {
      clearInterval(interval);
    };
  }, [execHealth]);

  return (
    <MainContent>
      <Section>
        <Container padded>
          <h1>Governor Admin</h1>
          <Grid>
            <Column md={8} sm={12}>
              <Card
                title={
                  <Container padded>
                    <h3>
                      <FaIcon icon="heartbeat" /> Server Health
                    </h3>
                  </Container>
                }
              >
                <Container padded>
                  {health.data.time > 0 && (
                    <Fragment>
                      {Array.isArray(health.data.errs) &&
                      health.data.errs.length > 0 ? (
                        <Fragment>
                          <h5>Errors</h5>
                          <ul>
                            {health.data.errs.map((errstring) => (
                              <li key={errstring}>{errstring}</li>
                            ))}
                          </ul>
                        </Fragment>
                      ) : (
                        <div>&#x2713; All Systems Normal</div>
                      )}
                      <div>
                        Last checked <Time value={health.data.time * 1000} />
                      </div>
                      <div>
                        <small>Refreshing every {REFRESH_TIME} seconds</small>
                      </div>
                    </Fragment>
                  )}
                  {health.err && <span>{health.err}</span>}
                </Container>
              </Card>
            </Column>
          </Grid>
        </Container>
      </Section>
    </MainContent>
  );
};

export default AdminContainer;
