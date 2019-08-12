import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './advertisement.reducer';
import { IAdvertisement } from 'app/shared/model/advertisement.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IAdvertisementDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class AdvertisementDetail extends React.Component<IAdvertisementDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { advertisementEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Advertisement [<b>{advertisementEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">Title</span>
            </dt>
            <dd>{advertisementEntity.title}</dd>
            <dt>
              <span id="description">Description</span>
            </dt>
            <dd>{advertisementEntity.description}</dd>
            <dt>
              <span id="active">Active</span>
            </dt>
            <dd>{advertisementEntity.active ? 'true' : 'false'}</dd>
            <dt>Profession</dt>
            <dd>{advertisementEntity.profession ? advertisementEntity.profession.name : ''}</dd>
            <dt>User</dt>
            <dd>{advertisementEntity.user ? advertisementEntity.user.login : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/advertisement" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/advertisement/${advertisementEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ advertisement }: IRootState) => ({
  advertisementEntity: advertisement.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvertisementDetail);
