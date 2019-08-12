import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IAdvertisement } from 'app/shared/model/advertisement.model';
import { getEntities as getAdvertisements } from 'app/entities/advertisement/advertisement.reducer';
import { getEntity, updateEntity, createEntity, reset } from './candidate.reducer';
import { ICandidate } from 'app/shared/model/candidate.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ICandidateUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ICandidateUpdateState {
  isNew: boolean;
  idsadvertisement: any[];
}

export class CandidateUpdate extends React.Component<ICandidateUpdateProps, ICandidateUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      idsadvertisement: [],
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    // this.props.getAdvertisements();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { candidateEntity } = this.props;
      const entity = {
        ...candidateEntity,
        ...values,
        advertisements: mapIdList(values.advertisements)
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/candidate');
  };

  render() {
    const { candidateEntity, advertisements, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="jobpostingApp.candidate.home.createOrEditLabel">Create or edit a Candidate</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : candidateEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="candidate-id">ID</Label>
                    <AvInput id="candidate-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="emailLabel" for="candidate-email">
                    Email
                  </Label>
                  <AvField
                    id="candidate-email"
                    name="email"
                    placeholder={'Your email'}
                    type="email"
                    validate={{
                      required: { value: true, errorMessage: 'Your email is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="firstNameLabel" for="candidate-firstName">
                    First Name
                  </Label>
                  <AvField
                    id="candidate-firstName"
                    type="text"
                    name="firstName"
                    validate={{
                      required: { value: true, errorMessage: 'Your first name is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="lastNameLabel" for="candidate-lastName">
                    Last Name
                  </Label>
                  <AvField
                    id="candidate-lastName"
                    type="text"
                    name="lastName"
                    validate={{
                      required: { value: true, errorMessage: 'Your last name is required.' }
                    }}
                  />
                </AvGroup>
                {/*<AvGroup>*/}
                {/*  <Label for="candidate-advertisement">Advertisement</Label>*/}
                {/*  <AvInput*/}
                {/*    id="candidate-advertisement"*/}
                {/*    type="select"*/}
                {/*    multiple*/}
                {/*    className="form-control"*/}
                {/*    name="advertisements"*/}
                {/*    value={candidateEntity.advertisements && candidateEntity.advertisements.map(e => e.id)}*/}
                {/*  >*/}
                {/*    <option value="" key="0" />*/}
                {/*    {advertisements*/}
                {/*      ? advertisements.map(otherEntity => (*/}
                {/*          <option value={otherEntity.id} key={otherEntity.id}>*/}
                {/*            {otherEntity.id}*/}
                {/*          </option>*/}
                {/*        ))*/}
                {/*      : null}*/}
                {/*  </AvInput>*/}
                {/*</AvGroup>*/}
                <Button tag={Link} id="cancel-save" to="/entity/candidate" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">Back</span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp; Save
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  advertisements: storeState.advertisement.entities,
  candidateEntity: storeState.candidate.entity,
  loading: storeState.candidate.loading,
  updating: storeState.candidate.updating,
  updateSuccess: storeState.candidate.updateSuccess
});

const mapDispatchToProps = {
  getAdvertisements,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CandidateUpdate);
