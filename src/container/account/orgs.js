import React from 'react';
import {Grid, Column} from '@xorkevin/nuke';

const Orgs = () => {
  return (
    <div>
      <h3>Organizations</h3>
      <hr />
      <Grid>
        <Column fullWidth md={16}>
          Orgs here
        </Column>
        <Column fullWidth md={8}>
          sidebar
        </Column>
      </Grid>
    </div>
  );
};

export default Orgs;
