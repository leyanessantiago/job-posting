import './home.scss';

import React, { Fragment } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { connect } from 'react-redux';
import { Alert, Card, CardBody, CardTitle, CardSubtitle, CardText, CardDeck, Button } from 'reactstrap';

import { IRootState } from 'app/shared/reducers';
import { IAdvertisement } from 'app/shared/model/advertisement.model';
import { uniqueId } from 'app/shared/util/unique-id';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  getActiveEntities as getActiveAdvertisements,
  getEntitiesByProfession as getAdvertisementsByProfession
} from 'app/entities/advertisement/advertisement.reducer';
import { getEntitiesByProfession as getCandidatesByProfession } from 'app/entities/candidate/candidate.reducer';

export interface IHomeProp extends StateProps, DispatchProps, RouteComponentProps<{ url: string }> {}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    if (this.props.isAuthenticated) {
      this.props.getAdvertisementsByProfession();
    } else {
      this.props.getActiveAdvertisements();
    }
  }

  renderCompany(companyName: string) {
    if (companyName) {
      return (
        <Fragment>
          <FontAwesomeIcon icon="building" fixedWidth /> {companyName}
        </Fragment>
      );
    }
    return null;
  }

  renderProfession(professionName: string) {
    if (professionName) {
      return (
        <Fragment>
          <FontAwesomeIcon icon="building" fixedWidth /> {professionName}
        </Fragment>
      );
    }
    return null;
  }

  renderAdvertisements = () => {
    const { activeAdvertisementList, match } = this.props;
    return activeAdvertisementList.map((ads: IAdvertisement) => {
      return (
        <Link key={uniqueId('home-advertisement')} to={`${match.url}advertisement/${ads.id}`} className="ads-card-wrapper">
          <Card body outline color="info" className="ads-card">
            <CardBody className="ads-card-body">
              <CardTitle className="ads-title">{ads.title}</CardTitle>
              <CardSubtitle className="ads-subtitle">
                {this.renderCompany(ads.user.companyName)}
                {this.renderProfession(ads.profession.name)}
              </CardSubtitle>
              <CardText className="ads-description">{ads.description}</CardText>
              <Button tag={Link} to={`${match.url}advertisement/${ads.id}/apply`} color="info" className="float-right">
                Apply
              </Button>
            </CardBody>
          </Card>
        </Link>
      );
    });
  };

  render() {
    const { account, advertisementsByProfession } = this.props;

    if (account && account.login) {
      return (
        <div>
          <Button onClick={() => this.props.getCandidatesByProfession()} color="info" className="float-right">
            Apply
          </Button>
          {/*<Alert color="success">You are logged in as user {account.login}.</Alert>*/}
        </div>
      );
    }

    return <CardDeck>{this.renderAdvertisements()}</CardDeck>;
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
  activeAdvertisementList: storeState.advertisement.allActiveEntities,
  advertisementsByProfession: storeState.advertisement.entitiesByProfession
});

const mapDispatchToProps = {
  getActiveAdvertisements,
  getAdvertisementsByProfession,
  getCandidatesByProfession
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
