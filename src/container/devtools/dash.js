import {Fragment, useEffect} from 'react';
import {useResource} from '@xorkevin/substation';
import {Container, Grid, Column, Card, Time} from '@xorkevin/nuke';

const REFRESH_TIME = 15;

const selectAPIHealth = (api) => api.healthz.ready;

const DashContainer = () => {
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

  const indicator = ['devtools-dash-health-indicator'];
  let statusMsg = 'All systems nominal';
  if (health.data.errs.length > 0) {
    indicator.push('error');
    statusMsg = 'Some systems experiencing errors';
  }

  return (
    <div>
      <h3>Dashboard</h3>
      <Grid>
        <Column fullWidth md={8} sm={12}>
          <Card
            title={
              <Container padded>
                <h4>Server Health</h4>
              </Container>
            }
          >
            <Container padded>
              {health.success && (
                <Fragment>
                  <Grid align="center">
                    <span className={indicator.join(' ')}></span>
                    <strong className="devtools-dash-health-status">
                      {statusMsg}
                    </strong>
                  </Grid>
                  <div>
                    <small>
                      Refreshing every {REFRESH_TIME} seconds. Last checked{' '}
                      <Time value={health.data.time * 1000} />
                    </small>
                  </div>
                  <ul>
                    {health.data.errs.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </Fragment>
              )}
              {health.err && <p>{health.err.message}</p>}
            </Container>
          </Card>
        </Column>
      </Grid>
    </div>
  );
};

export default DashContainer;
