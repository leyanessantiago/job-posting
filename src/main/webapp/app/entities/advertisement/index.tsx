import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Advertisement from './advertisement';
import AdvertisementDetail from './advertisement-detail';
import AdvertisementUpdate from './advertisement-update';
import AdvertisementDeleteDialog from './advertisement-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={AdvertisementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={AdvertisementUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={AdvertisementDetail} />
      <ErrorBoundaryRoute path={match.url} component={Advertisement} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={AdvertisementDeleteDialog} />
  </>
);

export default Routes;
