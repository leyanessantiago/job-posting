import React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { ICrudGetAction, ICrudDeleteAction, getSortState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IAdvertisement } from 'app/shared/model/advertisement.model';
import { IRootState } from 'app/shared/reducers';
import { getEntity, deleteEntity, getEntities } from './advertisement.reducer';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IAdvertisementDeleteDialogProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class AdvertisementDeleteDialog extends React.Component<IAdvertisementDeleteDialogProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  confirmDelete = event => {
    this.props.deleteEntity(this.props.advertisementEntity.id);
    this.handleClose(event);
  };

  handleClose = event => {
    event.stopPropagation();
    const { activePage, itemsPerPage, sort, order } = getSortState(this.props.location, ITEMS_PER_PAGE);
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
    this.props.history.goBack();
  };

  render() {
    const { advertisementEntity } = this.props;
    return (
      <Modal isOpen toggle={this.handleClose}>
        <ModalHeader toggle={this.handleClose}>Confirm delete operation</ModalHeader>
        <ModalBody id="jobpostingApp.advertisement.delete.question">Are you sure you want to delete this Advertisement?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.handleClose}>
            <FontAwesomeIcon icon="ban" />
            &nbsp; Cancel
          </Button>
          <Button id="jhi-confirm-delete-advertisement" color="danger" onClick={this.confirmDelete}>
            <FontAwesomeIcon icon="trash" />
            &nbsp; Delete
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = ({ advertisement }: IRootState) => ({
  advertisementEntity: advertisement.entity
});

const mapDispatchToProps = { getEntity, deleteEntity, getEntities };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvertisementDeleteDialog);
