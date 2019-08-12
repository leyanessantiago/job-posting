import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Candidate from './candidate';
import CandidateDetail from './candidate-detail';
import CandidateUpdate from './candidate-update';
import CandidateDeleteDialog from './candidate-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      {/*<ErrorBoundaryRoute exact path={`${match.url}/new`} component={CandidateUpdate} />*/}
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={CandidateUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={CandidateDetail} />
      <ErrorBoundaryRoute path={match.url} component={Candidate} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={CandidateDeleteDialog} />
  </>
);

export default Routes;
