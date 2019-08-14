import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntities as getProfessions } from 'app/entities/profession/profession.reducer';
import { getEntities as getCandidates } from 'app/entities/candidate/candidate.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { getEntity, updateEntity, createEntity, reset } from './advertisement.reducer';

export interface IAdvertisementUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IAdvertisementUpdateState {
  isNew: boolean;
  professionId: string;
  candidateId: string;
  userId: string;
}

export class AdvertisementUpdate extends React.Component<IAdvertisementUpdateProps, IAdvertisementUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      professionId: '0',
      candidateId: '0',
      userId: '0',
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

    this.props.getProfessions();
    this.props.getCandidates();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { advertisementEntity, account } = this.props;
      const entity = {
        ...advertisementEntity,
        ...values,
        user: { id: account.id }
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/advertisement');
  };

  render() {
    const { advertisementEntity, professions, candidates, users, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="jobpostingApp.advertisement.home.createOrEditLabel">Create or edit a Advertisement</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : advertisementEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="advertisement-id">ID</Label>
                    <AvInput id="advertisement-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="titleLabel" for="advertisement-title">
                    Title
                  </Label>
                  <AvField
                    id="advertisement-title"
                    type="text"
                    name="title"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="advertisement-description">
                    Description
                  </Label>
                  <AvField
                    style={{ minHeight: '180px' }}
                    id="advertisement-description"
                    type="textarea"
                    name="description"
                    validate={{
                      required: { value: true, errorMessage: 'This field is required.' }
                    }}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="advertisement-profession">Profession</Label>
                  <AvInput
                    id="advertisement-profession"
                    type="select"
                    className="form-control"
                    name="profession.id"
                    value={advertisementEntity.profession ? advertisementEntity.profession.id : null}
                    required
                  >
                    {professions
                      ? professions.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                  <AvFeedback>This field is required.</AvFeedback>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/advertisement" replace color="info">
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
  professions: storeState.profession.entities,
  candidates: storeState.candidate.entities,
  users: storeState.userManagement.users,
  advertisementEntity: storeState.advertisement.entity,
  loading: storeState.advertisement.loading,
  updating: storeState.advertisement.updating,
  updateSuccess: storeState.advertisement.updateSuccess,
  account: storeState.authentication.account
});

const mapDispatchToProps = {
  getProfessions,
  getCandidates,
  getUsers,
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
)(AdvertisementUpdate);
