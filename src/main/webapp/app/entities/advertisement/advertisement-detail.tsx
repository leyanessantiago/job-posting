import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Card, CardBody, CardText, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './advertisement.reducer';

export interface IAdvertisementDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class AdvertisementDetail extends React.Component<IAdvertisementDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  renderCompany() {
    const { user } = this.props.advertisementEntity;

    if (user && user.companyName) {
      return (
        <li className="advertisement-details-item">
          <FontAwesomeIcon icon="building" fixedWidth /> {user.companyName}
        </li>
      );
    }
    return null;
  }

  renderProfession() {
    const { profession } = this.props.advertisementEntity;
    if (profession && profession.name) {
      return (
        <li className="advertisement-details-item">
          <FontAwesomeIcon icon="briefcase" fixedWidth /> {profession.name}
        </li>
      );
    }
    return null;
  }

  render() {
    const { advertisementEntity, match } = this.props;
    return (
      <div className="advertisement-details_wrapper">
        <div className="advertisement-details_aside-sticky">
          <div>
            <div className="" style={{ transform: 'translateZ(0px)' }}>
              <aside className="advertisement-details_aside">
                <h1 className="text-sub-headline advertisement-details_heading">{advertisementEntity.title}</h1>
                <Button tag={Link} to={`${match.url}/apply`} color="info">
                  Apply
                </Button>
                <ul className="advertisement-details_aside-list">
                  {this.renderCompany()}
                  {this.renderProfession()}
                </ul>
              </aside>
            </div>
          </div>
        </div>
        <Card className="advertisement-details_description">
          <CardBody>
            <CardText>{advertisementEntity.description}</CardText>
          </CardBody>
        </Card>
      </div>
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
