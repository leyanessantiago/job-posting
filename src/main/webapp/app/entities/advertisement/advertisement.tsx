/* tslint:disable:jsx-no-lambda */
import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Row, Table, Input } from 'reactstrap';
import './advertisement.scss';
// tslint:disable-next-line:no-unused-variable
import { ICrudGetAllAction, getSortState, IPaginationBaseState, JhiPagination, JhiItemCount } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntities, updateEntity } from './advertisement.reducer';
import { IAdvertisement } from 'app/shared/model/advertisement.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ITEMS_PER_PAGE } from 'app/shared/util/pagination.constants';

export interface IAdvertisementProps extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export type IAdvertisementState = IPaginationBaseState;

export class Advertisement extends React.Component<IAdvertisementProps, IAdvertisementState> {
  state: IAdvertisementState = {
    ...getSortState(this.props.location, ITEMS_PER_PAGE)
  };

  componentDidMount() {
    this.getEntities();
  }

  sort = prop => () => {
    this.setState(
      {
        order: this.state.order === 'asc' ? 'desc' : 'asc',
        sort: prop
      },
      () => this.sortEntities()
    );
  };

  sortEntities() {
    this.getEntities();
    this.props.history.push(`${this.props.location.pathname}?page=${this.state.activePage}&sort=${this.state.sort},${this.state.order}`);
  }

  handlePagination = activePage => this.setState({ activePage }, () => this.sortEntities());

  getEntities = () => {
    const { activePage, itemsPerPage, sort, order } = this.state;
    this.props.getEntities(activePage - 1, itemsPerPage, `${sort},${order}`);
  };

  handleActive = async (event: any, advertisement: IAdvertisement) => {
    const entity = advertisement;
    entity.active = event.target.checked;
    await this.props.updateEntity(entity);
    this.getEntities();
  };

  render() {
    const { advertisementList, match, totalItems, activeAdvertisementsCount } = this.props;
    return (
      <div>
        <h2 id="advertisement-heading">
          Advertisements
          <Link to={`${match.url}/new`} className="btn btn-primary float-right jh-create-entity" id="jh-create-entity">
            <FontAwesomeIcon icon="plus" />
            &nbsp; Create a new Advertisement
          </Link>
        </h2>
        <div className="table-responsive">
          {advertisementList && advertisementList.length > 0 ? (
            <Table responsive className="entity-table">
              <thead>
                <tr>
                  <th className="hand" onClick={this.sort('id')}>
                    ID <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('title')}>
                    Title <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('description')}>
                    Description <FontAwesomeIcon icon="sort" />
                  </th>
                  <th className="hand" onClick={this.sort('active')}>
                    Active <FontAwesomeIcon icon="sort" />
                  </th>
                  <th>
                    Profession <FontAwesomeIcon icon="sort" />
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {advertisementList.map((advertisement, i) => (
                  <tr key={`entity-${i}`}>
                    <td>
                      <Button tag={Link} to={`${match.url}/${advertisement.id}`} color="link" size="sm">
                        {advertisement.id}
                      </Button>
                    </td>
                    <td>{advertisement.title}</td>
                    <td className="hand advertisement-description-column">{advertisement.description}</td>
                    <td className="advertisement-active-column">
                      <Input
                        type="checkbox"
                        checked={advertisement.active}
                        disabled={!advertisement.active && activeAdvertisementsCount >= 10}
                        onChange={event => this.handleActive(event, advertisement)}
                      />
                    </td>
                    <td>
                      {advertisement.profession ? (
                        <Link to={`profession/${advertisement.profession.id}`}>{advertisement.profession.name}</Link>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="text-right">
                      <div className="btn-group flex-btn-group-container">
                        <Button tag={Link} to={`${match.url}/${advertisement.id}`} color="info" size="sm">
                          <FontAwesomeIcon icon="eye" /> <span className="d-none d-md-inline">View</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${advertisement.id}/edit`} color="primary" size="sm">
                          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
                        </Button>
                        <Button tag={Link} to={`${match.url}/${advertisement.id}/delete`} color="danger" size="sm">
                          <FontAwesomeIcon icon="trash" /> <span className="d-none d-md-inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="alert alert-warning">No Advertisements found</div>
          )}
        </div>
        <div className={advertisementList && advertisementList.length > 0 ? '' : 'd-none'}>
          <Row className="justify-content-center">
            <JhiItemCount page={this.state.activePage} total={totalItems} itemsPerPage={this.state.itemsPerPage} />
          </Row>
          <Row className="justify-content-center">
            <JhiPagination
              activePage={this.state.activePage}
              onSelect={this.handlePagination}
              maxButtons={5}
              itemsPerPage={this.state.itemsPerPage}
              totalItems={this.props.totalItems}
            />
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ advertisement }: IRootState) => ({
  advertisementList: advertisement.entities,
  totalItems: advertisement.totalItems,
  activeAdvertisementsCount: advertisement.activeEntitiesCount
});

const mapDispatchToProps = {
  getEntities,
  updateEntity
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Advertisement);
