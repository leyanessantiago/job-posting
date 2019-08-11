import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './candidate.reducer';
import { ICandidate } from 'app/shared/model/candidate.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICandidateDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class CandidateDetail extends React.Component<ICandidateDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { candidateEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            Candidate [<b>{candidateEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="email">Email</span>
            </dt>
            <dd>{candidateEntity.email}</dd>
            <dt>
              <span id="firstName">First Name</span>
            </dt>
            <dd>{candidateEntity.firstName}</dd>
            <dt>
              <span id="lastName">Last Name</span>
            </dt>
            <dd>{candidateEntity.lastName}</dd>
            <dt>Advertisement</dt>
            <dd>
              {candidateEntity.advertisements
                ? candidateEntity.advertisements.map((val, i) => (
                    <span key={val.id}>
                      <a>{val.id}</a>
                      {i === candidateEntity.advertisements.length - 1 ? '' : ', '}
                    </span>
                  ))
                : null}
            </dd>
          </dl>
          <Button tag={Link} to="/entity/candidate" replace color="info">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/candidate/${candidateEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ candidate }: IRootState) => ({
  candidateEntity: candidate.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CandidateDetail);
