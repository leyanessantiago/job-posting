import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Profession from './profession';
import Advertisement from './advertisement';
import Candidate from './candidate';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/profession`} component={Profession} />
      <ErrorBoundaryRoute path={`${match.url}/advertisement`} component={Advertisement} />
      <ErrorBoundaryRoute path={`${match.url}/candidate`} component={Candidate} />
      {/* jhipster-needle-add-route-path - JHipster will add routes here */}
    </Switch>
  </div>
);

export default Routes;
